@extends('layouts.app')

@section('title', 'Edit User')

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
            <form method="post" action="{{ route('users.update', $user->id) }}">
                @csrf
                @method('patch')
                <input type="text" name="name" value="{{ old('name', $user->name) }}" placeholder="Full Name" required>
                <input type="email" name="email" value="{{ old('email', $user->email) }}" placeholder="Email Address" required>
                <input type="password" name="password" placeholder="Password">
                <select name="role">
                    <option value="1" {{ old('role', $user->role) == 1 ? 'selected' : '' }}>Role 1</option>
                    <option value="2" {{ old('role', $user->role) == 2 ? 'selected' : '' }}>Role 2</option>
                    <option value="3" {{ old('role', $user->role) == 3 ? 'selected' : '' }}>Role 3</option>
                    <option value="4" {{ old('role', $user->role) == 4 ? 'selected' : '' }}>Role 4</option>
                </select>
                <input type="submit" name="" value="Update User">
                <br><br>
            </form>
        </div>
    </div>
</div>
@endsection
