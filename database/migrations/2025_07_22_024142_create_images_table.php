<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->string('file_path'); // 画像ファイルの保存パス
            $table->string('alt_text')->nullable(); // 代替テキスト
            $table->string('title'); // 画像タイトル
            $table->decimal('price_s', 10, 2)->nullable(); // Sサイズ用金額
            $table->decimal('price_l', 10, 2)->nullable(); // Lサイズ用金額
            $table->decimal('price_other', 10, 2)->nullable(); // その他サイズ用金額
            $table->text('caption')->nullable(); // 画像の説明やキャプション
            $table->unsignedBigInteger('category_id'); // カテゴリーID
            $table->integer('display_order')->nullable(); // 表示順
            $table->boolean('is_public')->default(true); // 公開/非公開
            $table->datetime('start_at')->nullable(); // 公開開始日時
            $table->datetime('end_at')->nullable();   // 公開終了日時
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};
