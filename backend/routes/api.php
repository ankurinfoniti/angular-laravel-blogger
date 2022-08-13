<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/blogs', [ApiController::class, 'blogs']);
Route::get('/featured-blogs', [ApiController::class, 'featuredBlogs']);
Route::get('/recent-blogs', [ApiController::class, 'recentBlogs']);
Route::get('/categories', [ApiController::class, 'categories']);
Route::get('/blog/{id}', [ApiController::class, 'blog']);
Route::get('/page/{slug}', [ApiController::class, 'page']);
Route::post('/contact', [ApiController::class, 'contact']);
Route::post('/login', [ApiController::class, 'login']);
Route::get('/admin-blogs', [ApiController::class, 'adminBlogs']);
Route::get('/admin-blog/{id}', [ApiController::class, 'adminBlog']);
Route::post('/create-blog', [ApiController::class, 'createBlog']);
Route::post('/update-blog/{id}', [ApiController::class, 'updateBlog']);
Route::delete('/delete-blog/{id}', [ApiController::class, 'deleteBlog']);

Route::get('/admin-categories', [ApiController::class, 'adminCategories']);
Route::get('/admin-category/{id}', [ApiController::class, 'adminCategory']);
Route::post('/create-category', [ApiController::class, 'createCategory']);
Route::post('/update-category/{id}', [ApiController::class, 'updateCategory']);
Route::delete('/delete-category/{id}', [ApiController::class, 'deleteCategory']);
