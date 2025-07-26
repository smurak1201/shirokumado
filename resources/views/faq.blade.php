@extends('layouts.app')

@section('title', 'よくある質問')

@section('content')
    <h1 class="text-2xl font-bold text-center mt-8 mb-6 ">よくある質問</h1>
    <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white rounded-2xl shadow p-8">
                <h2 class="font-semibold text-lg mb-2">かき氷の販売は夏だけですか？</h2>
                <p class="text-gray-700 mb-4">通年で営業しており、季節ごとに異なるメニューもご用意しています。</p>
            </div>
            <div class="bg-white rounded-2xl shadow p-8">
                <h2 class="font-semibold text-lg mb-2">予約は出来ますか？</h2>
                <p class="text-gray-700 mb-4">
                    ご予約は承っておりませんが、状況に応じて順にご案内しております。混み合う時間帯はお待ちいただく場合がございますので、あらかじめご了承ください。なお、グループでのご来店の場合は、皆さまがおそろいになってからのご案内とさせていただいております。
                </p>
            </div>
            <div class="bg-white rounded-2xl shadow p-8">
                <h2 class="font-semibold text-lg mb-2">定休日はありますか？</h2>
                <p class="text-gray-700 mb-4">月に１回、不定休を設けています。</p>
            </div>
            <div class="bg-white rounded-2xl shadow p-8">
                <h2 class="font-semibold text-lg mb-2">席は先に確保できますか？</h2>
                <p class="text-gray-700 mb-4">
                    恐れ入りますが、事前に席をお取りいただくことはご遠慮いただいております。皆さまが快適にお過ごしいただけますよう、ご理解とご協力のほどよろしくお願い申し上げます。</p>
            </div>
            <div class="bg-white rounded-2xl shadow p-8">
                <h2 class="font-semibold text-lg mb-2">休業日はどこで確認できますか？</h2>
                <p class="text-gray-700 mb-4">最新の営業情報はInstagramでお知らせしています。</p>
            </div>
            <div class="bg-white rounded-2xl shadow p-8">
                <h2 class="font-semibold text-lg mb-2">会計はいつ行えばよいですか？</h2>
                <p class="text-gray-700 mb-4">当店では、レジにて先にご注文とお会計を済ませていただいた後にお席へご案内しております。</p>
            </div>
            <div class="bg-white rounded-2xl shadow p-8">
                <h2 class="font-semibold text-lg mb-2">営業時間を教えてください。</h2>
                <p class="text-gray-700 mb-4">１１：００～２１：００で営業しております。<br>ラストオーダーは２０：００です。</p>
            </div>
            <div class="bg-white rounded-2xl shadow p-8">
                <h2 class="font-semibold text-lg mb-2">会計は現金のみですか？</h2>
                <p class="text-gray-700 mb-4">当店では、キャッシュレス決済に対応しております。 クレジットカード、交通系IC、各種QRコード決済をご利用いただけます。</p>
            </div>
            <div class="bg-white rounded-2xl shadow p-8">
                <h2 class="font-semibold text-lg mb-2">電話がつながらないことがあるのですが、どうすればいいですか？</h2>
                <p class="text-gray-700 mb-4">混雑時など店舗の状況により、電話にすぐ対応できない場合がございます。お急ぎの場合は、少し時間を空けて再度おかけ直しいただけますと幸いです。</p>
            </div>
            <div class="bg-white rounded-2xl shadow p-8">
                <h2 class="font-semibold text-lg mb-2">席の利用時間に制限はありますか？</h2>
                <p class="text-gray-700 mb-4">
                    当店では、ゆっくりとお食事をお楽しみいただけるよう努めておりますが、混雑時には、お食事がお済みのお客さまへお声がけをさせていただく場合がございます。席をお待ちのお客さまがいらっしゃる際には、ご協力いただけますと幸いです。
                </p>
            </div>
            <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
                <h2 class="font-semibold text-lg mb-2">人数分の注文は必要ですか？</h2>
                <p class="text-gray-700 mb-4">
                    恐れ入りますが、当店ではお一人につき1点以上のご注文をお願いしております。お席のご利用にあたって、皆さまに気持ちよくお過ごしいただけるよう、ご協力をお願い申し上げます。
                    また、小さなお子さまや体調・ご事情などでご注文が難しい場合は、どうぞ遠慮なくスタッフまでご相談くださいませ。</p>
            </div>
            <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
                <h2 class="font-semibold text-lg mb-2">店内でお水の提供はありますか？</h2>
                <p class="text-gray-700 mb-4">当店では店内でのお冷のご提供は行っておりません。そのため、飲み物のお持ち込みは歓迎しております。
                    ただし、食事の持ち込みはご遠慮いただいておりますので、あらかじめご了承いただけますと幸いです。</p>
            </div>
        </div>
    </div>
@endsection
