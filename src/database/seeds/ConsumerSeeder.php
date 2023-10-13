<?php

use App\Models\Consumer;
use Illuminate\Database\Seeder;
class ConsumerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (Consumer::count() === 0) {
            factory(Consumer::class, 1)->create();
        } else {
            $this->command->info('Consumer records already exist, skipping factory creation.');
        }
    }
}
