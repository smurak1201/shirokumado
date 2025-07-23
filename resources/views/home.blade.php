<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <title>白熊堂</title>
    <!-- サイト説明文 -->
    <meta name="description" content="白熊堂は本格かき氷のお店です。ふわふわの氷とこだわりのシロップでお待ちしています。">
    <!-- スマホ対応 -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- OGP（SNSシェア用） -->
    <meta property="og:title" content="白熊堂">
    <meta property="og:description" content="本格かき氷のお店・白熊堂の公式サイト">
    <meta property="og:image" content="{{ asset('storage/images/tenpo_gaikan.jpg') }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <link rel="icon" href="{{ asset('favicon.ico') }}">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>

<body>
    <div class="hero-container">
        <img class="hero-image" src="{{ asset('storage/images/tenpo_gaikan.jpg') }}" alt="店舗外観">
    </div>
</body>
