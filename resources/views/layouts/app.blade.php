<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <title>@yield('title', '白熊堂')</title>
    <meta name="description" content="白熊堂は本格かき氷のお店です。ふわふわの氷とこだわりのシロップでお待ちしています。">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:title" content="白熊堂">
    <meta property="og:description" content="本格かき氷のお店・白熊堂の公式サイト">
    <meta property="og:image" content="{{ asset('storage/images/tenpo_gaikan.jpg') }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <link rel="icon" href="{{ asset('favicon.ico') }}">

    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="bg-white text-gray-900 font-sans w-full overflow-x-hidden">
    @include('partials.header')
    <main class="w-full max-w-xl mx-auto px-2 sm:px-4">
        @yield('content')
    </main>
    @include('partials.footer')
</body>

</html>
