# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Hike.destroy_all
Comment.destroy_all

test_hike_1 = Hike.create(sharer_name: Faker::Name.unique.name, hike_name: 'Lykken Trail', img: 'https://www.gannett-cdn.com/media/2017/10/08/PalmSprings/PalmSprings/636430793325986985-oswitcanyon-2.jpg?width=2560', city: 'Palm Springs', state: 'Ca', duration: 90, likes: 10)
test_hike_2 = Hike.create(sharer_name: Faker::Name.unique.name, hike_name: 'Lykken Trail', img: 'https://www.gannett-cdn.com/media/2017/10/08/PalmSprings/PalmSprings/636430793325986985-oswitcanyon-2.jpg?width=2560', city: 'Palm Springs', state: 'Ca', duration: 90, likes: 10)
test_hike_3 = Hike.create(sharer_name: Faker::Name.unique.name, hike_name: 'Lykken Trail', img: 'https://www.gannett-cdn.com/media/2017/10/08/PalmSprings/PalmSprings/636430793325986985-oswitcanyon-2.jpg?width=2560', city: 'Palm Springs', state: 'Ca', duration: 90, likes: 10)

hikes = [test_hike_1, test_hike_2, test_hike_3]

hikes.each do |hike|
    i = 0 
    while i < 5 do 
        Comment.create(
            name: Faker::Name.unique.name, 
            content: Faker::Lorem.sentence(word_count: 10),
            hike: hike
    )
        i += 1
    end
end
