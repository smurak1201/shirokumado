<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <title>ヒーロー画像</title>
    <style>
        .hero-container {
            width: 100vw;
            height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f8f8;
        }

        .hero-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }
    </style>
</head>

<body>
    <div class="hero-container">
        <img class="hero-image" src="{{ asset('storage/images/tenpo_gaikan.jpg') }}" alt="店舗外観">
    </div>
</body>

</html>
