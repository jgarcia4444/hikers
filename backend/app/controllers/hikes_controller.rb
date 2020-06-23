class HikesController < ApplicationController
    
    def index
        hikes = Hike.all
        render json: hikes
    end

end