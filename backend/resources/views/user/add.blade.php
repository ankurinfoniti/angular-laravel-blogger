@extends('layouts.app')

@section('title', 'Add User')

@section('content')
<div class="split left">
    <div class="centered"></div>
</div>

<div class="split right">
    <div class="centered">
        <div class="signupbox">
            <img src="{{ asset('/external/img/logo.webp') }}" class="avatar">
            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            <form method="post" action="{{ route('users.store') }}">
                @csrf
                <input type="text" name="name" value="{{ old('name') }}" placeholder="Full Name" required>
                <input type="email" name="email" value="{{ old('email') }}" placeholder="Email Address" required>
                <input type="password" name="password" placeholder="Password" required>
                <select name="role">
                    <option value="1" {{ old('role') == 1 ? 'selected' : '' }}>Role 1</option>
                    <option value="2" {{ old('role') == 2 ? 'selected' : '' }}>Role 2</option>
                    <option value="3" {{ old('role') == 3 ? 'selected' : '' }}>Role 3</option>
                    <option value="4" {{ old('role') == 4 ? 'selected' : '' }}>Role 4</option>
                </select>
                <input type="submit" name="" value="Add User">
                <br><br>
            </form>
        </div>
    </div>
</div>
@endsection
