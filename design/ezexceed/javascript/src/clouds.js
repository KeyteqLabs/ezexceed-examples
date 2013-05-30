define(['underscore', 'backbone', 'jquery-safe'], function(_, Backbone, $)
{
    return Backbone.View.extend({
        MAX_SPEED: 5,
        running: true,
        initialize: function()
        {
            _.bindAll(this);
            this.images = {};
        },

        render: function()
        {
            this.trigger('loaded');
            this.$el.html('<canvas id="clouds"></canvas>');

            // Canvas setup
            this.h = this.$el.height();
            this.w = this.$el.width();
            this.canvas = this.$('canvas')[0];
            this.canvas.width = this.w;
            this.canvas.height = this.h;
            this.context = this.canvas.getContext('2d');

            // Bootstrap cloud image
            this._image = new Image;
            this._image.onload = this.animate;
            this._image.src = '/extension/ezexceed/design/ezexceed/images/kp/128x128/Cloud.png';

            return this;
        },


        animate : function(time)
        {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            _.range(10).map(this.addImage);
            if (this.running) {
                requestAnimationFrame(this.animate);
            }
        },

        addImage : function(num) {
            var image = this.image(num);
            if (image.x && image.y) {
                // If out of bounds on right
                if (image.x + image.movement > (this.w - image.size)) {
                    image.direction = -1;
                }
                else if (image.x - image.movement < 0) {
                    image.direction = 1;
                }
                image.x = image.x + (image.direction * image.movement);
            }
            else {
                image.x = parseInt(Math.random(0, 1) * this.w * .9, 10);
                image.y = parseInt(Math.random(0, 1) * this.h * .9, 10);
            }
            this.context.drawImage(this._image, image.x, image.y, image.size, image.size);
        },

        image : function(id) {
            if (!_.has(this.images, id)) {
                this.images[id] = {
                    size: [32, 48, 128][parseInt(Math.random(0,1) * 3, 10)],
                    movement : 1 + parseInt(Math.random(0, 2) * this.MAX_SPEED),
                    direction : id % 2 ? 1 : -1
                };
            }
            return this.images[id];
        }
    });
});
