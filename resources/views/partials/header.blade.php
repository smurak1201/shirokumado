<header class="flex items-center gap-4 px-3 py-2 border-b border-gray-200 bg-transparent">
    <h1 class="m-0 flex items-center gap-4">
        <a href="{{ url('/') }}">
            <img src="{{ asset('images/tenpo_icon.jpg') }}" alt="白熊堂ロゴ" class="block w-[120px] h-auto object-contain">
        </a>
        <a href="https://www.instagram.com/shirokumado2021/#" target="_blank" rel="noopener" title="Instagram">
            <img src="{{ asset('images/Instagram_Glyph_Black-scaled.png') }}" alt="Instagram"
                class="w-8 h-8 max-w-[32px] max-h-[32px] object-contain align-middle">
        </a>
    </h1>
    <nav class="ml-auto flex gap-4">
        <a href="{{ url('/faq') }}"
            class="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">よくある質問</a>
        <a href="{{ url('/instagram') }}"
            class="text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors">投稿一覧</a>
    </nav>
</header>
