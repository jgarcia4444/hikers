class CommentsController < ApplicationController

    def index
        hike = Hike.find(params[:hike_id])
        comments = hike.comments
        render json: comments
    end

end