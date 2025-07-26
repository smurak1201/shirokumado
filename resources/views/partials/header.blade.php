<header x-data="{ open: false }" class="flex items-center gap-4 px-3 py-2 border-b border-gray-200 bg-transparent">
    <h1 class="m-0 flex items-center gap-4">
        <a href="{{ url('/') }}">
            <img src="{{ asset('images/tenpo_icon.jpg') }}" alt="白熊堂ロゴ" class="block w-[120px] h-auto object-contain">
        </a>
        <a href="https://www.instagram.com/shirokumado2021/#" target="_blank" rel="noopener" title="Instagram">
            <img src="{{ asset('images/Instagram_Glyph_Black-scaled.png') }}" alt="Instagram"
                class="w-8 h-8 max-w-[32px] max-h-[32px] object-contain align-middle">
        </a>
    </h1>
    <!-- ハンバーガーボタン（スマホのみ表示） -->
    <button @click="open = !open"
        class="ml-auto md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="メニューを開く">
        <svg class="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
    </button>
    <!-- ナビゲーション -->
    <nav :class="{ 'block': open, 'hidden': !open }"
        class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-40 md:static md:bg-transparent md:w-auto md:h-auto md:flex md:items-center md:gap-4 md:ml-auto md:z-auto md:p-0 transition-all"
        @click.away="open = false">
        <div
            class="bg-white rounded-2xl shadow p-8 mx-4 mt-24 md:mt-0 md:mx-0 md:shadow-none md:bg-transparent md:p-0 flex flex-col md:flex-row gap-6 md:gap-4 items-center">
            <a href="{{ url('/instagram') }}"
                class="text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors">投稿一覧</a>
            <a href="{{ url('/faq') }}"
                class="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">よくある質問</a>
            <button @click="open = false" class="absolute top-4 right-8 md:hidden text-gray-500 hover:text-gray-800"
                aria-label="閉じる">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </button>
        </div>
    </nav>
</header>
