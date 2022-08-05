<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'username' => 'test',
            'password' => Hash::make('12345'),
            'name' => 'Test User',
            'token' => '827ccb0eea8a706c4c34a16891f84e7b',
            'role' => 1,
            'is_active' => 1,
        ]);
    }
}
