<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Model\Blog;
use App\Model\Category;
use App\Model\Page;
use App\Model\User;
use App\Model\Contact;
use App\Model\BlogVote;
use App\Model\Comment;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ApiController extends Controller
{
    public function blogs(Request $request)
    {
        $page = $request->page;
        $limit = $request->limit;
        $categorySlug = $request->category;

        $blogs = Blog::with('user:id,name')
            ->with('category:id,category_name')
            ->limit($limit)
            ->offset($limit * ($page - 1))
            ->orderBy('id', 'desc')
            ->where('is_active', 1)
            ->when($categorySlug, function ($query) use ($categorySlug) {
                $query->whereHas('category', function ($query) use ($categorySlug) {
                    $query->where('slug', $categorySlug);
                });
            })
            ->get();

        $total = Blog::when($categorySlug, function ($query) use ($categorySlug) {
            $query->whereHas('category', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            });
        })->where('is_active', 1)->count();

        return ['blog' => $blogs, 'total' => $total];
    }

    public function featuredBlogs()
    {
        $blogs = Blog::with('user:id,name')
            ->with('category:id,category_name')
            ->where('is_active', 1)
            ->where('is_featured', 1)
            ->orderBy('id', 'desc')
            ->limit(9)
            ->get();

        return $blogs;
    }

    public function recentBlogs()
    {
        $blogs = Blog::with('user:id,name')
            ->with('category:id,category_name')
            ->where('is_active', 1)
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get();

        return $blogs;
    }

    public function categories()
    {
        return Category::select('id', 'category_name', 'slug')->get();
    }

    public function blog($slug)
    {
        $blog = Blog::with('user:id,name')
            ->with('category:id,category_name')
            ->with('vote:id,blog_id,like,dislike')
            ->where('slug', $slug)
            ->first();

        return $blog;
    }

    public function page($slug)
    {
        $page = Page::select('id', 'title', 'description')->where('slug', $slug)->first();

        return $page;
    }

    public function contact(Request $request)
    {
        $contactData = array(
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'message' => $request->message,
            'created_at' => date('Y-m-d H:i:s', time())
        );

        $response = Contact::insert($contactData);

        return ['id' => $response];
    }

    public function login(Request $request)
    {
        $username = $request->username;
        $password = $request->password;

        $user = User::where('username', $username)->first(); // ->where('is_active', 1)

        if ($user && !Hash::check($password, $user->password)) {
            return ['status' => 'error', 'message' => 'Username or password is incorrect.'];
        }

        if ($user && !$user->is_active) {
            return ['status' => 'error', 'message' => 'User is currently inactive.'];
        }

        if ($user && Hash::check($password, $user->password)) {
            $response = array(
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'token' => $user->token,
                'role' => $user->role
            );
        } else {
            $response = [];
        }

        return $response;
    }

    public function adminBlogs(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $posts = [];
        $total = 0;

        if ($user) {
            $page = $request->page;
            $limit = $request->limit;
            $role = $user->role;
            $userId = $user->id;

            $query = Blog::with('user:id,name')
                ->limit($limit)
                ->offset($limit * ($page - 1))
                ->orderBy('id', 'DESC');

            $totalQuery = Blog::select('id', 'title', 'image', 'created_at');

            if ($role != 1) {
                $query->where('user_id', $userId);
                $totalQuery->where('user_id', $userId);
            }

            $posts = $query->get();
            $total = $totalQuery->count();
        }

        return ['posts' => $posts, 'total' => $total];
    }

    public function adminBlog(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $post = null;

        if ($user) {
            $role = $user->role;

            $query = Blog::select('id', 'title', 'category_id', 'description', 'image', 'is_featured', 'is_active', 'created_at')
                ->where('id', $id);

            if ($role != 1) {
                $query->where('user_id', $user->id);
            }
            $post = $query->first();
        }

        return $post;
    }

    public function createBlog(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $response = [];

        if ($user) {
            $role = $user->role;
            $title = $request->title;
            $slug = $this->createSlug($request->title);
            $category = $request->category;
            $description = $request->description;
            $is_featured = $request->is_featured;
            $is_active = $role == 1 ? $request->is_active : 0;

            $filename = null;

            if ($request->hasFile('image')) {
                $file = $request->image->getClientOriginalName();
                $filename = preg_replace('/\s+/', '_', strtolower(pathinfo($file, PATHINFO_FILENAME)))
                    . time() . '.' . $request->image->getClientOriginalExtension();

                $request->image->move(public_path('/images'), $filename);
            }

            $blog = new Blog();

            $blog->title = $title;
            $blog->slug = $slug;
            $blog->user_id = $user->id;
            $blog->category_id = $category;
            $blog->description = $description;
            $blog->image = $filename;
            $blog->is_featured = $is_featured;
            $blog->is_active = $is_active;

            if ($blog->save()) {
                $response['status'] = 'success';
                $response['message'] = 'Record inserted successfully';
                $response['uploadError'] = false;
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record insertion failed';
                $response['uploadError'] = false;
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
            $response['uploadError'] = false;
        }

        return $response;
    }

    public function createSlug($title, $id = 0)
    {
        $slug = Str::slug($title);
        $allSlugs = $this->getRelatedSlugs($slug, $id);
        if (!$allSlugs->contains('slug', $slug)) {
            return $slug;
        }

        $i = 1;
        $is_contain = true;
        do {
            $newSlug = $slug . '-' . $i;
            if (!$allSlugs->contains('slug', $newSlug)) {
                $is_contain = false;
                return $newSlug;
            }
            $i++;
        } while ($is_contain);
    }

    protected function getRelatedSlugs($slug, $id = 0)
    {
        return Blog::select('slug')->where('slug', 'like', $slug . '%')
            ->where('id', '<>', $id)
            ->get();
    }

    public function updateBlog(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user) {
            $role = $user->role;
            $title = $request->title;
            $category = $request->category;
            $description = $request->description;
            $is_featured = $request->is_featured;

            $filename = null;

            if ($request->hasFile('image')) {
                $file = $request->image->getClientOriginalName();
                $filename = preg_replace('/\s+/', '_', strtolower(pathinfo($file, PATHINFO_FILENAME)))
                    . time() . '.' . $request->image->getClientOriginalExtension();

                $request->image->move(public_path('/images'), $filename);
            }

            $blog = Blog::find($id);

            $blog->title = $title;
            $blog->category_id = $category;
            $blog->description = $description;
            $blog->is_featured = $is_featured;
            $blog->is_active = $role == 1 ? $request->is_active : $blog->is_active;

            if ($filename) {
                $blog->image = $filename;
            }

            if ($blog->save()) {
                $response['status'] = 'success';
                $response['message'] = 'Record updated successfully';
                $response['uploadError'] = false;
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record updation failed';
                $response['uploadError'] = false;
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
            $response['uploadError'] = false;
        }

        return $response;
    }

    public function deleteBlog(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user && $user->role === 1) {
            $blog = Blog::find($id);

            if ($blog->image) {
                File::delete(public_path() . parse_url($blog->image)['path']);
            }

            if ($blog->delete()) {
                $response['status'] = 'success';
                $response['message'] = 'Record deleted successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record deletion failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function adminCategories(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $categories = [];

        if ($user && $user->role === 1) {
            $categories = Category::select('id', 'category_name', 'created_at')->orderBy('id', 'DESC')->get();
        }

        return $categories;
    }

    public function adminCategory(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $category = null;

        if ($user && $user->role === 1) {
            $category = Category::select('id', 'category_name', 'created_at')->where('id', $id)->first();
        }

        return $category;
    }

    public function createCategory(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $response = [];

        if ($user && $user->role === 1) {
            $category = new Category();

            $category->category_name = $request->name;
            $category->slug = Str::slug($request->name);

            if ($category->save()) {
                $response['status'] = 'success';
                $response['message'] = 'Record inserted successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record insertion failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function updateCategory(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user && $user->role === 1) {
            $category = Category::find($id);

            $category->category_name = $request->name;

            if ($category->save()) {
                $response['status'] = 'success';
                $response['message'] = 'Record updated successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record updation failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function deleteCategory(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user && $user->role === 1) {
            $category = Category::find($id);

            if ($category->delete()) {
                $response['status'] = 'success';
                $response['message'] = 'Record deleted successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record deletion failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function adminPages(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $pages = [];

        if ($user && $user->role === 1) {
            $pages = Page::select('id', 'title', 'slug', 'description', 'is_active', 'created_at')->orderBy('id', 'DESC')->get();
        }

        return $pages;
    }

    public function adminPage(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $page = null;

        if ($user && $user->role === 1) {
            $page = Page::select('id', 'title', 'slug', 'description', 'is_active', 'created_at')->where('id', $id)->first();
        }

        return $page;
    }

    public function createPage(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $response = [];

        if ($user && $user->role === 1) {
            $page = new Page();

            $page->title = $request->title;
            $page->slug = Str::slug($request->title);
            $page->description = $request->description;
            $page->is_active = $request->is_active;

            if ($page->save()) {
                $response['status'] = 'success';
                $response['message'] = 'Record inserted successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record insertion failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function updatePage(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user && $user->role === 1) {
            $page = Page::find($id);

            $page->title = $request->title;
            $page->slug = Str::slug($request->title);
            $page->description = $request->description;
            $page->is_active = $request->is_active;

            if ($page->save()) {
                $response['status'] = 'success';
                $response['message'] = 'Record updated successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record updation failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
            $response['uploadError'] = false;
        }

        return $response;
    }

    public function deletePage(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user && $user->role === 1) {
            $page = Page::find($id);

            if ($page->delete()) {
                $response['status'] = 'success';
                $response['message'] = 'Record deleted successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record deletion failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function checkUserName(Request $request)
    {
        $username = $request->username;

        $count = User::where('username', $username)->count();

        if ($count) {
            return true;
        }

        return false;
    }

    public function createUser(Request $request)
    {
        $page = new User();

        $page->username = $request->username;
        $page->name = $request->name;
        $page->password = Hash::make($request->password);
        $page->token = md5(rand());
        $page->role = 2;
        $page->is_active = 0;
        $response = [];

        if ($page->save()) {
            $response['status'] = 'success';
            $response['message'] = 'User registered successfully';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'User registration failed';
        }

        return $response;
    }

    public function adminUsers(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $users = [];
        $total = 0;

        if ($user && $user->role === 1) {
            $page = $request->page;
            $limit = $request->limit;

            $users = User::select('id', 'name', 'username', 'role', 'is_active', 'created_at')
                ->where('id', '!=', $user->id)
                ->limit($limit)
                ->offset($limit * ($page - 1))
                ->orderBy('id', 'DESC')
                ->get();

            $total = User::select('id')
                ->where('id', '!=', $user->id)
                ->count();
        }

        return ['users' => $users, 'total' => $total];
    }

    public function activateUser(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user && $user->role === 1) {
            $id = $request->id;
            $status = $request->status;

            $user = User::find($id);

            $user->is_active = $status;

            if ($user->save()) {
                $response['status'] = 'success';
                $response['message'] = 'Record updated successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record updation failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function updateUser(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user && $user->id == $id) {
            $user = User::find($id);

            $user->name = $request->name;

            if ($request->password) {
                $user->password = Hash::make($request->password);
            }

            if ($user->save()) {
                $response['status'] = 'success';
                $response['message'] = 'Record updated successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record updation failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function deleteUser(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user && $user->role === 1) {
            $user = User::find($id);

            if ($user->delete()) {
                $response['status'] = 'success';
                $response['message'] = 'Record deleted successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record deletion failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function blogVote(Request $request)
    {
        $blogId = $request->blog_id;
        $actionType = $request->action;

        $blogVote = BlogVote::where('blog_id', $blogId)->first();

        if ($actionType === 'like') {
            $vote = ['like' => $blogVote ? $blogVote->like + 1 : 1];
        } else {
            $vote = ['dislike' => $blogVote ? $blogVote->dislike + 1 : 1];
        }

        $voted = BlogVote::updateOrCreate(
            ['blog_id' => $blogId],
            $vote,
        );

        return $voted;
    }

    public function comments(Request $request)
    {
        return Comment::select('id', 'body', 'username', 'user_id as userId', 'parent_id as parentId', 'created_at as createdAt')->get();
    }

    public function createComment(Request $request)
    {
        $comment = new Comment();

        $comment->body = $request->body;
        $comment->blog_id = $request->blogId;
        $comment->username = $request->username;
        $comment->user_id = $request->userId;
        $comment->parent_id = $request->parentId;

        $comment->save();
        return Comment::select('id', 'body', 'username', 'user_id as userId', 'parent_id as parentId', 'created_at as createdAt')
            ->where('id', $comment->id)
            ->first();
    }

    public function updateComment(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $comment = Comment::find($id);

        if ($user && $comment && $user->id === $comment->user_id) {
            $comment->body = $request->body;

            if ($comment->save()) {
                $response['status'] = 'success';
                $response['data'] = Comment::select('id', 'body', 'username', 'user_id as userId', 'parent_id as parentId', 'created_at as createdAt')
                    ->where('id', $comment->id)
                    ->first();
            } else {
                $response['status'] = 'error';
                $response['data'] = 'Record updation failed';
            }
        } else {
            $response['status'] = 'error';
            $response['data'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function deleteComment(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $comment = Comment::find($id);

        if ($user && $comment && $user->id === $comment->user_id) {
            if ($comment->delete()) {
                $response['status'] = 'success';
                $response['message'] = 'Record deleted successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record deletion failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function dashboardTotal(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $total = [];
        $recentBlogs = [];
        $recentComments = [];

        if ($user) {
            $role = $user->role;
            $userId = $user->id;

            if ($role == 1) {
                $total['blogTotal'] = Blog::count();
                $total['userTotal'] = User::count();
                $total['likeTotal'] = BlogVote::count();
                $total['inactiveTotal'] = Blog::where('is_active', 0)->count();

                $recentBlogs = Blog::select('title', 'image', 'is_active as isActive')->orderBy('id', 'DESC')->limit(5)->get();
                $recentComments = Comment::select('body', 'username')->orderBy('id', 'DESC')->limit(5)->get();
            } else {
                $total['blogTotal'] = Blog::where('user_id', $userId)->count();
                $ids = Blog::select('id')->where('user_id', $userId)->get();
                $total['likeTotal'] = BlogVote::whereIn('blog_id', $ids)->sum('like');
                $total['dislikeTotal'] = BlogVote::whereIn('blog_id', $ids)->sum('dislike');

                $recentBlogs = Blog::select('title', 'image', 'is_active as isActive')
                    ->where('user_id', $userId)
                    ->orderBy('id', 'DESC')
                    ->limit(5)
                    ->get();
                $recentComments = Comment::select('body', 'username')
                    ->whereIn('blog_id', $ids)
                    ->orderBy('id', 'DESC')
                    ->limit(5)
                    ->get();
            }
        }

        return ['total' => $total, 'recentBlogs' => $recentBlogs, 'recentComments' => $recentComments];
    }
}
