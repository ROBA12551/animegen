exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { prompt, language = 'en', isAdult = false } = JSON.parse(event.body);

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Prompt is required' })
            };
        }

        const enhancedPrompt = enhancePromptMultilingual(prompt, language, isAdult);

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: 'success',
                originalPrompt: prompt,
                enhancedPrompt: enhancedPrompt,
                language: language,
                isAdult: isAdult
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

function enhancePromptMultilingual(prompt, language = 'en', isAdult = false) {
    // 言語の正規化
    const lang = language.toLowerCase().split('-')[0];
    
    // 言語検出（入力テキストから）
    const detectedLang = detectLanguage(prompt);
    
    // ローカライズされたプロンプト改善
    const localizedEnhancer = getLocalizationStrategy(detectedLang || lang);
    
    return localizedEnhancer(prompt, isAdult);
}

function detectLanguage(text) {
    // 簡単な言語検出
    const cjkRegex = /[\u4E00-\u9FFF\u3040-\u309F\uAC00-\uD7AF]/g;
    const cyrillicRegex = /[\u0400-\u04FF]/g;
    const arabicRegex = /[\u0600-\u06FF]/g;
    
    if (cjkRegex.test(text)) {
        if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
        if (/[\u3040-\u309F]/.test(text)) return 'ja';
        if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';
    }
    if (cyrillicRegex.test(text)) return 'ru';
    if (arabicRegex.test(text)) return 'ar';
    
    return 'en';
}

function getLocalizationStrategy(language) {
    const strategies = {
        'ja': enhanceJapanese,
        'zh': enhanceChinese,
        'ko': enhanceKorean,
        'ru': enhanceRussian,
        'ar': enhanceArabic,
        'es': enhanceSpanish,
        'fr': enhanceFrench,
        'de': enhanceGerman,
        'en': enhanceEnglish
    };

    return strategies[language] || strategies['en'];
}

function enhanceEnglish(prompt, isAdult = false) {
    const cleanPrompt = prompt.trim().toLowerCase();
    
    let enhanced = cleanPrompt;
    
    if (!enhanced.includes('anime')) {
        enhanced += ', anime style';
    }
    
    if (cleanPrompt.includes('girl') || cleanPrompt.includes('boy') || cleanPrompt.includes('character')) {
        enhanced += ', detailed character, expressive eyes, soft lighting, vibrant colors, professional artwork';
    } else {
        enhanced += ', beautiful composition, professional quality';
    }
    
    if (!enhanced.includes('quality') && !enhanced.includes('masterpiece')) {
        enhanced += ', best quality, high detail, sharp focus, masterpiece';
    }
    
    if (!enhanced.includes('background')) {
        enhanced += ', pleasant background';
    }
    
    if (!enhanced.includes('lighting') && !enhanced.includes('light')) {
        enhanced += ', soft lighting, volumetric light';
    }
    
    enhanced += ', 2d illustration, anime illustration, perfect composition, clean artwork';
    
    // アダルトコンテンツ用タグ追加
    if (isAdult) {
        enhanced += ', sexy, sensual, adult content, nsfw, explicit, nude, detailed body';
    }
    
    return enhanced;
}

function enhanceJapanese(prompt, isAdult = false) {
    // 日本語プロンプトの改善
    let enhanced = prompt;
    
    if (!enhanced.includes('アニメ')) {
        enhanced += ', アニメスタイル';
    }
    
    if (prompt.includes('女の子') || prompt.includes('男の子') || prompt.includes('キャラ')) {
        enhanced += ', 詳細なキャラクター, 表情豊かな目, ソフトライティング, 鮮やかな色, プロフェッショナル作品';
    }
    
    if (!enhanced.includes('品質') && !enhanced.includes('高品質')) {
        enhanced += ', 最高品質, 高詳細, シャープフォーカス, 傑作';
    }
    
    if (!enhanced.includes('背景')) {
        enhanced += ', 美しい背景';
    }
    
    if (!enhanced.includes('ライティング')) {
        enhanced += ', ソフトライティング, 体積光';
    }
    
    enhanced += ', 2d イラスト, アニメイラスト, 完璧な構図, クリーン作品';
    
    // アダルトコンテンツ用タグ追加
    if (isAdult) {
        enhanced += ', セクシー, 官能的, 成人向け, nsfw, 明示的, ヌード, 詳細な体';
    }
    
    // 英語タグも含める
    enhanced = enhanced.replace(/、/g, ', ').toLowerCase();
    enhanced += ', anime style, high quality, masterpiece';
    
    return enhanced;
}

function enhanceChinese(prompt, isAdult = false) {
    let enhanced = prompt;
    
    if (!enhanced.includes('动画')) {
        enhanced += ', 动画风格';
    }
    
    if (prompt.includes('女孩') || prompt.includes('男孩') || prompt.includes('角色')) {
        enhanced += ', 细致的角色, 富有表现力的眼睛, 柔和的照明, 鲜艳的色彩, 专业作品';
    }
    
    if (!enhanced.includes('质量') && !enhanced.includes('高质量')) {
        enhanced += ', 最高质量, 高细节, 清晰焦点, 杰作';
    }
    
    if (!enhanced.includes('背景')) {
        enhanced += ', 愉快的背景';
    }
    
    enhanced += ', 2d插图, 动画插图, 完美构图, 干净作品';
    
    // アダルトコンテンツ用タグ追加
    if (isAdult) {
        enhanced += ', 性感, 诱人, 成人内容, nsfw, 露骨, 裸体, 详细的身体';
    }
    
    enhanced += ', anime style, high quality, masterpiece';
    
    return enhanced;
}

function enhanceKorean(prompt, isAdult = false) {
    let enhanced = prompt;
    
    if (!enhanced.includes('애니메')) {
        enhanced += ', 애니메 스타일';
    }
    
    if (prompt.includes('여자') || prompt.includes('남자') || prompt.includes('캐릭터')) {
        enhanced += ', 상세한 캐릭터, 표현력 있는 눈, 부드러운 조명, 생생한 색상, 전문 작품';
    }
    
    if (!enhanced.includes('품질')) {
        enhanced += ', 최고 품질, 고 디테일, 선명한 초점, 걸작';
    }
    
    enhanced += ', 2d 일러스트, 애니메 일러스트, 완벽한 구도, 깔끔한 작품';
    
    // アダルトコンテンツ用タグ追加
    if (isAdult) {
        enhanced += ', 섹시한, 관능적인, 성인용, nsfw, 노골적인, 나체, 상세한 몸';
    }
    
    enhanced += ', anime style, high quality, masterpiece';
    
    return enhanced;
}

function enhanceRussian(prompt, isAdult = false) {
    let enhanced = prompt;
    
    if (!enhanced.includes('аниме')) {
        enhanced += ', стиль аниме';
    }
    
    if (prompt.includes('девочка') || prompt.includes('мальчик') || prompt.includes('персонаж')) {
        enhanced += ', детализированный персонаж, выразительные глаза, мягкое освещение, яркие цвета, профессиональное искусство';
    }
    
    if (!enhanced.includes('качество')) {
        enhanced += ', высочайшее качество, высокая детализация, резкий фокус, шедевр';
    }
    
    enhanced += ', 2d иллюстрация, аниме иллюстрация, идеальная композиция';
    
    // アダルトコンテンツ用タグ追加
    if (isAdult) {
        enhanced += ', сексуальный, чувственный, взрослый контент, nsfw, откровенный, обнаженный, детальное тело';
    }
    
    enhanced += ', anime style, high quality, masterpiece';
    
    return enhanced;
}

function enhanceArabic(prompt, isAdult = false) {
    let enhanced = prompt;
    
    if (!enhanced.includes('أنمي')) {
        enhanced += ', نمط الأنمي';
    }
    
    enhanced += ', شخصية مفصلة, إضاءة ناعمة, ألوان حية, عمل احترافي';
    enhanced += ', أعلى جودة, تفاصيل عالية, تركيز حاد, تحفة';
    
    // アダルトコンテンツ用タグ追加
    if (isAdult) {
        enhanced += ', مثير, حسي, محتوى للبالغين, nsfw, صريح, عاري, جسم مفصل';
    }
    
    enhanced += ', anime style, high quality, masterpiece';
    
    return enhanced;
}

function enhanceSpanish(prompt, isAdult = false) {
    let enhanced = prompt.toLowerCase();
    
    if (!enhanced.includes('anime')) {
        enhanced += ', estilo anime';
    }
    
    if (prompt.includes('chica') || prompt.includes('chico') || prompt.includes('personaje')) {
        enhanced += ', personaje detallado, ojos expresivos, iluminación suave, colores vibrantes, obra profesional';
    }
    
    if (!enhanced.includes('calidad')) {
        enhanced += ', máxima calidad, alto detalle, enfoque nítido, obra maestra';
    }
    
    enhanced += ', ilustración 2d, ilustración anime, composición perfecta, obra limpia';
    
    // アダルトコンテンツ用タグ追加
    if (isAdult) {
        enhanced += ', sexy, sensual, contenido para adultos, nsfw, explícito, desnudo, cuerpo detallado';
    }
    
    enhanced += ', anime style, high quality, masterpiece';
    
    return enhanced;
}

function enhanceFrench(prompt, isAdult = false) {
    let enhanced = prompt.toLowerCase();
    
    if (!enhanced.includes('anime')) {
        enhanced += ', style anime';
    }
    
    if (prompt.includes('fille') || prompt.includes('garçon') || prompt.includes('personnage')) {
        enhanced += ', personnage détaillé, yeux expressifs, éclairage doux, couleurs vibrantes, œuvre professionnelle';
    }
    
    if (!enhanced.includes('qualité')) {
        enhanced += ', qualité maximale, haut détail, mise au point nette, chef-d\'œuvre';
    }
    
    enhanced += ', illustration 2d, illustration anime, composition parfaite, œuvre propre';
    
    // アダルトコンテンツ用タグ追加
    if (isAdult) {
        enhanced += ', sexy, sensuel, contenu pour adultes, nsfw, explicite, nu, corps détaillé';
    }
    
    enhanced += ', anime style, high quality, masterpiece';
    
    return enhanced;
}

function enhanceGerman(prompt, isAdult = false) {
    let enhanced = prompt.toLowerCase();
    
    if (!enhanced.includes('anime')) {
        enhanced += ', Anime-Stil';
    }
    
    if (prompt.includes('mädchen') || prompt.includes('junge') || prompt.includes('charakter')) {
        enhanced += ', detaillierter charakter, ausdrucksstarke augen, weiches licht, lebendige farben, professionelles werk';
    }
    
    if (!enhanced.includes('qualität')) {
        enhanced += ', höchste qualität, hohe detaillierung, scharfer fokus, meisterwerk';
    }
    
    enhanced += ', 2d-illustration, anime-illustration, perfekte komposition, sauberes werk';
    
    // アダルトコンテンツ用タグ追加
    if (isAdult) {
        enhanced += ', sexy, sinnlich, inhalte für erwachsene, nsfw, explizit, nackt, detaillierter körper';
    }
    
    enhanced += ', anime style, high quality, masterpiece';
    
    return enhanced;
}