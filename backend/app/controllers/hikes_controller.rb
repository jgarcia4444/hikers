class HikesController < ApplicationController
    
    def index
        hikes = Hike.all
        render json: hikes
    end

    def create
        newHike = Hike.create(hike_params)
    end

    private
        def hike_params
            params.require(:hike).permit(:sharer_name, :hike_name, :city, :state, :duration, :likes, :img)
        end

end