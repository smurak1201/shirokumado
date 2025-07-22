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
            ['file_path' => 'tenpo_icon.jpg', 'title' => '店舗アイコン'],
            ['file_path' => 'tenpo_gaikan.jpg', 'title' => '店舗外観'],
            ['file_path' => 'matcha_momen_mascar.jpg', 'title' => '抹茶木綿マスカル'],
            ['file_path' => 'namonori_choco_mint_kori.jpg', 'title' => '波のり超チョコミント氷'],
            ['file_path' => 'nijiiro_kakigori.png', 'title' => 'にじいろかき氷'],
            ['file_path' => 'shirokuma_dx.png', 'title' => '白くまDX'],
            ['file_path' => 'chocolate_milk.png', 'title' => 'チョコレートみるく'],
            ['file_path' => 'kougarashi_hot_chai_kakigori.jpg', 'title' => '香がらしのホットなチャイかき氷'],
            ['file_path' => 'kaori_ichigo_mango.png', 'title' => '香りいちごとマンゴー'],
            ['file_path' => 'kaori_ichigo_milk.png', 'title' => '香りいちごみるく'],
            ['file_path' => 'fruit_tomato_milk.jpg', 'title' => 'フルーツトマトミルク'],
            ['file_path' => 'blue_hawaii_kakigori.png', 'title' => 'ブルーハワイかき氷'],
            ['file_path' => 'mango_milk.png', 'title' => 'マンゴーみるく'],
            ['file_path' => 'kokutou_coffee_milk.png', 'title' => '黒糖珈琲みるく'],
            ['file_path' => 'Instagram_Glyph_Black-scaled.png', 'title' => 'Instagram_Glyph_Black-scaled.png'],
            ['file_path' => 'Instagram_Glyph_Gradient-scaled.png', 'title' => 'Instagram_Glyph_Gradient-scaled.png'],
            ['file_path' => 'Instagram_Glyph_White-scaled.png', 'title' => 'Instagram_Glyph_White-scaled.png'],
            ['file_path' => 'Kinaco.png', 'title' => 'Kinaco.png'],
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
