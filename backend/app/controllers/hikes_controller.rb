class HikesController < ApplicationController
    
    def index
        hikes = Hike.all
        sorted_hikes = newest_hike_first(hikes)
        render json: sorted_hikes
    end

    def create
        newHike = Hike.create(hike_params)
        render json: newHike
    end

    def update
        hike = Hike.find(params[:id])
        user_that_liked = User.find(params[:user_id])
        hike.update(likes: params[:hike][:likes])
        LikedHike.create(hike_id: hike.id, user_id: user_that_liked.id)
    end

    def destroy
        hike = Hike.find(params[:id])
        hike.destroy
    end

    def filter
        hikes = Hike.where(state: params[:state])
        sorted_hikes = newest_hike_first(hikes)
        render json: sorted_hikes
    end

    private

        def newest_hike_first(hikes)
            hikes.sort { |a, b| b.created_at <=> a.created_at }
        end

        def hike_params
            params.require(:hike).permit(:user_id, :hike_name, :city, :state, :duration, :likes, :img)
        end

end