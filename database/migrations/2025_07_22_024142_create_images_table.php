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
            $table->text('caption')->nullable(); // 画像の説明やキャプション
            $table->string('alt_text')->nullable(); // 代替テキスト
            $table->unsignedBigInteger('category_id'); // カテゴリーID
            $table->integer('display_order')->nullable(); // 表示順
            $table->boolean('is_public')->default(true); // 公開/非公開
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
