class CommentsController < ApplicationController

    def index
        hike = Hike.find(params[:hike_id])
        comments = hike.comments
        render json: comments
    end

    def create
        Comment.create(comment_params)
    end

    private
        def comment_params
            params.require(:comment).permit(:name, :content, :hike_id)
        end

end