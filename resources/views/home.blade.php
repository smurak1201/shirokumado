@extends('layouts.app')

@section('title', '白熊堂')

<link rel="stylesheet" href="{{ asset('css/content.css') }}">
@section('content')
<div class="hero-container">
    <img class="hero-image" src="{{ asset('storage/images/tenpo_gaikan.jpg') }}" alt="店舗外観">
</div>

@if(isset($images) && count($images))
<div class="menu-limited-container">
    @foreach($images as $image)
    <div class="menu-limited-item">
        <img
            class="menu-limited-image"
            src="{{ asset('storage/images/' . $image->file_path) }}"
            alt="{{ $image->alt_text ?? $image->title }}">
        @if(!empty($image->title))
        <div class="menu-limited-title">{{ $image->title }}</div>
        @endif
        @if(!empty($image->caption))
        <div class="menu-limited-caption">{{ $image->caption }}</div>
        @endif
    </div>
    @endforeach
</div>
@endif
@endsection
