<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $images = [
            ['file_path' => 'tenpo_icon.jpg', 'title' => '店舗アイコン', 'alt_text' => '店舗アイコン'],
            ['file_path' => 'tenpo_gaikan.jpg', 'title' => '店舗外観', 'alt_text' => '店舗外観'],
            ['file_path' => 'matcha_momen_mascar.jpg', 'title' => '抹茶木綿マスカル', 'alt_text' => '抹茶木綿マスカル', 'price_s' => null, 'price_l' => 1600, 'price_other' => null, 'caption' => '自家製の抹茶シロップに、木綿豆腐とマスカルポーネを合わせたクリームをトッピング。粒あん入り。抹茶の苦みと洋酒の香りの木綿マスカルクリームのコクがリッチな味わい。', 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
            ['file_path' => 'namonori_choco_mint_kori.jpg', 'title' => '波のり超チョコミント氷', 'alt_text' => '波のり超チョコミント氷', 'price_s' => null, 'price_l' => 2400, 'price_other' => null, 'caption' => "食べ物アート作家「鴨志田和泉」氏コラボメニュー。毎年恒例の波のり氷！今年はチョコミント！爽やかな見た目と口当たりで涼を楽しめるかき氷。日差しの強い真夏の海をオレンジとサーフボードクッキー、ミントホイップで表現", 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
            ['file_path' => 'nijiiro_kakigori.png', 'title' => 'にじいろかき氷', 'alt_text' => 'にじいろかき氷', 'price_s' => 900, 'price_l' => null, 'price_other' => null, 'caption' => 'カラフルな屋台味かき氷を天然氷でお楽しみください。', 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
            ['file_path' => 'shirokuma_dx.png', 'title' => '白くまDX', 'alt_text' => '白くまDX', 'price_s' => 1400, 'price_l' => 1800, 'price_other' => null, 'caption' => '白熊堂の看板メニュー【黒糖珈琲みるく】にホイップクリーム、白玉、あずきをトッピングした豪華メニュー。', 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
            ['file_path' => 'chocolate_milk.png', 'title' => 'チョコレートみるく', 'alt_text' => 'チョコレートみるく', 'price_s' => 1200, 'price_l' => 1600, 'price_other' => null, 'caption' => '白熊堂特製ミルクソースに、チョコレートシロップとココアパウダーがかかったかき氷。ホイップクリームのトッピングがおススメ。', 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
            ['file_path' => 'kougarashi_hot_chai_kakigori.jpg', 'title' => '香がらしのホットなチャイかき氷', 'alt_text' => '香がらしのホットなチャイかき氷', 'price_s' => null, 'price_l' => 1800, 'price_other' => null, 'caption' => 'フルーティな香りが特徴の「香がらし」を使用したかき氷。チャイ風に仕上げた「香がらしシロップ」と「香がらしホイップ」「パプリカクリーム」「ミルクベース」の構成。辛さ控えめな甘く冷たい燃焼系かき氷', 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
            ['file_path' => 'kaori_ichigo_mango.png', 'title' => '香りいちごとマンゴー', 'alt_text' => '香りいちごとマンゴー', 'price_s' => 1600, 'price_l' => 2000, 'price_other' => null, 'caption' => 'いちごもマンゴーも両方食べたいという方のためのハーフ＆ハーフの贅沢かき氷。特製ミルクもかかっています。', 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
            ['file_path' => 'kaori_ichigo_milk.png', 'title' => '香りいちごみるく', 'alt_text' => '香りいちごみるく', 'price_s' => 1500, 'price_l' => 1900, 'price_other' => null, 'caption' => 'スパイスで香り付けした苺のソースと特製ミルクのかき氷。ちょっぴりスパイシーで甘酸っぱい仕上がり。', 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
            ['file_path' => 'fruit_tomato_milk.jpg', 'title' => 'フルーツトマトミルク', 'alt_text' => 'フルーツトマトミルク', 'price_s' => null, 'price_l' => 1600, 'price_other' => null, 'caption' => 'トマト特有の青さを残し、トマトの甘みと旨味を引き出したソースに特製ミルクを合わせました。終盤にはゴルゴンゾーラミルクのクセあまじょっぱい味わいが現れます。', 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
            ['file_path' => 'blue_hawaii_kakigori.png', 'title' => 'ブルーハワイかき氷', 'alt_text' => 'ブルーハワイかき氷', 'price_s' => 800, 'price_l' => 1200, 'price_other' => null, 'caption' => '屋台の定番ブルーハワイかき氷を天然氷で召し上がってみてください。', 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
            ['file_path' => 'mango_milk.png', 'title' => 'マンゴーみるく', 'alt_text' => 'マンゴーみるく', 'price_s' => 1000, 'price_l' => 1400, 'price_other' => null, 'caption' => '白熊堂の定番メニュー。特製ミルクをベースに濃厚マンゴーソースをかけたフルーティなかき氷。', 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
            ['file_path' => 'kokutou_coffee_milk.png', 'title' => '黒糖珈琲みるく', 'alt_text' => '黒糖珈琲みるく', 'price_s' => 1000, 'price_l' => 1400, 'price_other' => null, 'caption' => '白熊堂の看板メニュー。沖縄県産の黒糖と珈琲を煮詰めて作る黒糖珈琲シロップと特製ミルクのどこか懐かしい味わいのかき氷です。', 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
            ['file_path' => 'Instagram_Glyph_Black-scaled.png', 'title' => 'Instagram_Glyph_Black-scaled.png', 'alt_text' => 'Instagram_Glyph_Black-scaled.png'],
            ['file_path' => 'Instagram_Glyph_Gradient-scaled.png', 'title' => 'Instagram_Glyph_Gradient-scaled.png', 'alt_text' => 'Instagram_Glyph_Gradient-scaled.png'],
            ['file_path' => 'Instagram_Glyph_White-scaled.png', 'title' => 'Instagram_Glyph_White-scaled.png', 'alt_text' => 'Instagram_Glyph_White-scaled.png'],
            ['file_path' => 'Kinaco.png', 'title' => 'Kinaco.png', 'alt_text' => 'Kinaco.png', 'price_s' => 1500, 'price_l' => null, 'price_other' => null, 'caption' => 'きな粉が主役のかき氷。特製ミルク、きな粉ソース、きな粉、あずき、白玉、ホイップクリームで和テイストに仕上がっています。', 'category_id' => 1, 'display_order' => null, 'is_public' => true, 'start_at' => null, 'end_at' => null],
        ];

        foreach ($images as $img) {
            \DB::table('images')->insert([
                'file_path' => $img['file_path'],
                'title' => $img['title'],
                'alt_text' => $img['title'],
                'caption' => null,
                'category_id' => 1,
                'display_order' => null,
                'is_public' => true,
                'price_s' => null,
                'price_l' => null,
                'price_other' => null,
                'start_at' => null,
                'end_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
