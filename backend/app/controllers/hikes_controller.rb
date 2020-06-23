class HikesController < ApplicationController
    
    def index
        hikes = Hike.all
        newest_hike_first = hikes.sort { |a, b| b.created_at <=> a.created_at }
        render json: newest_hike_first
    end

    def create
        newHike = Hike.create(hike_params)
    end

    private
        def hike_params
            params.require(:hike).permit(:sharer_name, :hike_name, :city, :state, :duration, :likes, :img)
        end

end