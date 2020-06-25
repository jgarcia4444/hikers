# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Hike.destroy_all
Comment.destroy_all

test_hike_1 = Hike.create(sharer_name: 'test1', hike_name: 'Lykken Trail', img: 'https://www.gannett-cdn.com/media/2017/10/08/PalmSprings/PalmSprings/636430793325986985-oswitcanyon-2.jpg?width=2560', city: 'Palm Springs', state: 'Ca', duration: 90, likes: 10)
Hike.create(sharer_name: 'test2', hike_name: 'Lykken Trail', img: 'https://www.gannett-cdn.com/media/2017/10/08/PalmSprings/PalmSprings/636430793325986985-oswitcanyon-2.jpg?width=2560', city: 'Palm Springs', state: 'Ca', duration: 90, likes: 10)
Hike.create(sharer_name: 'test3', hike_name: 'Lykken Trail', img: 'https://www.gannett-cdn.com/media/2017/10/08/PalmSprings/PalmSprings/636430793325986985-oswitcanyon-2.jpg?width=2560', city: 'Palm Springs', state: 'Ca', duration: 90, likes: 10)
seed_comments = [
    {name: 'test_commentor_1', content: 'test comment #1', hike: test_hike_1},
    {name: 'test_commentor_2', content: 'test comment #2', hike: test_hike_1},
    {name: 'test_commentor_3', content: 'test comment #3', hike: test_hike_1}
]

seed_comments.each do |comment_hash|
    Comment.create(comment_hash)
end
