// mymatrix.js
//
// simulates a simple grid of clickable widgets (a la matrixctrl)

// inlets and outlets
inlets = 1;
outlets = 1;
autowatch = 1;

function Matrix(config) {
    config = config || this.default_config;

    for (var name in config)
        this[name] = config[name];

    this.state = new Array(this.columns);

    for (var c = 0; c < this.columns; ++c)
        this.state[c] = new Array(this.rows);
};

Matrix.prototype.clear = function() {
    for (var c = 0; c < this.columns; ++c)
        for (var r = 0; r < this.rows; ++r)
            this.state[c][r] = 0;
};

Matrix.prototype.default_config = {
    rows: 4,
    columns: 4,
    color: {
        background: [0.8, 1.0, 0.8, 0.5],
        disabled: [0.9, 0.5, 0.5, 0.75],
        enabled: [1.0, 0.0, 0.2, 1.0]
    }
};

Matrix.prototype.draw = function() {
	with (sketch)
	{
		// set how the polygons are rendered
        var vbrgb = this.color.background,
            vfrgb = this.color.enabled,
            vmrgb = this.color.disabled;
		glclearcolor(vbrgb[0], vbrgb[1], vbrgb[2], vbrgb[3]); // set the clear color
		glclear(); // erase the background
		colstep = 2.0 / this.columns; // how much to move over per column
		rowstep = 2.0 / this.rows; // how much to move over per row
		for (var i = 0; i < this.columns; i++) // iterate through the columns
		{
			for (var j = 0; j < this.rows; j++) // iterate through the rows
			{
				moveto((i*colstep + colstep/2)-1.0,
                       1.0 - (j*rowstep + rowstep/2), 0.); // move the drawing point
				if (this.state[i][j]) // set 'on' color
					glcolor(vfrgb[0], vfrgb[1], vfrgb[2], vfrgb[3]);
				else // set 'off' color (midway between vbrgb and vfrgb)
					glcolor(vmrgb[0], vmrgb[1], vmrgb[2], vmrgb[3]);
				circle(0.7 / Math.max(this.rows, this.columns)); // draw the circle
			}
		}
	}
    refresh();
};

var matrix = new Matrix();

// set up jsui defaults to 2d
sketch.default2d();

// initialize graphics
matrix.draw();

function bang() {
    matrix.draw();
};

// onresize -- deal with a resized jsui box
function onresize(w,h)
{
	matrix.draw(); // draw and refresh display
};

// onclick -- deal with mouse click event
function onclick(x,y)
{
	var worldx = sketch.screentoworld(x, y)[0];
	var worldy = sketch.screentoworld(x, y)[1];

	var colwidth = 2.0 / matrix.columns; // width of a column, in world coordinates
	var rowheight = 2.0 / matrix.rows; // width of a row, in world coordinates

	var x_click = Math.floor((worldx + 1.0) / colwidth); // which column we clicked
	var y_click = Math.floor((1.0 - worldy) / rowheight); // which row we clicked

	matrix.state[x_click][y_click] = !matrix.state[x_click][y_click]; // flip the state of the clicked point
	outlet(0, x_click, y_click, matrix.state[x_click][y_click]); // output the coordinates and state of the clicked point

	matrix.draw(); // draw and refresh display
};

// ondblclick -- pass buck to onclick()
function ondblclick(x, y)
{
	onclick(x, y);
};

// Make functions private to prevent triggering from Max.
onclick.local = 1;
ondblclick.local = 1;
onresize.local = 1;
