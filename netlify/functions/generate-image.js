const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { prompt, aspectRatio = '1:1', isPremium = false, isAdult = false } = JSON.parse(event.body);

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Prompt is required' })
            };
        }

        // 高品質化パラメータ（プレミアム時）
        const qualityModifier = isPremium 
            ? ', ultra HD, 8k, masterpiece, award-winning, professional, cinematic lighting, volumetric lighting, raytracing, subsurface scattering, volumetric fog'
            : ', HD, 4k, professional quality';

        const enhancedPrompt = `${prompt}${qualityModifier}`;

        // アスペクト比の変換
        const aspectRatioMap = {
            '1:1': '512x512',
            '16:9': '768x512',
            '9:16': '512x768',
            '4:3': '640x480',
            '3:4': '480x640'
        };

        const dimensions = aspectRatioMap[aspectRatio] || '512x512';
        const [width, height] = dimensions.split('x').map(Number);

        // ネガティブプロンプト（アダルト対応）
        const negativePrompt = isAdult
            ? 'poor quality, low quality, watermark, text, logo'
            : 'nsfw, nude, explicit, poor quality, low quality, watermark';

        // 外部API（Replicate、Hugging Face等）を呼び出し
        // ここでは例として、Replicateを使用
        const externalApiKey = process.env.REPLICATE_API_KEY;
        
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${externalApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: 'a45f6a1d4ce1669d4c631b91534e114314408fae4d2b6e23adcff0b9058e998', // Anime Anything v3
                input: {
                    prompt: enhancedPrompt,
                    width: width,
                    height: height,
                    num_outputs: 1,
                    scheduler: isPremium ? 'karras' : 'normal',
                    num_inference_steps: isPremium ? 50 : 30,
                    guidance_scale: isPremium ? 7.5 : 5,
                    negative_prompt: negativePrompt
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.detail || 'API error' })
            };
        }

        // 非同期処理 - 完了まで待機
        let prediction = data;
        let attempts = 0;
        const maxAttempts = 600; // 20分

        while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const checkResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
                headers: {
                    'Authorization': `Token ${externalApiKey}`
                }
            });

            prediction = await checkResponse.json();
            attempts++;
        }

        if (prediction.status === 'failed') {
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    status: 'failed',
                    error: prediction.error || 'Generation failed' 
                })
            };
        }

        if (prediction.status !== 'succeeded') {
            return {
                statusCode: 504,
                body: JSON.stringify({ 
                    status: 'timeout',
                    error: 'Generation timeout' 
                })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: 'success',
                imageUrl: prediction.output[0],
                aspectRatio: aspectRatio
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};