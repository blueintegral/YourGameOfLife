var Cell = {
  alive: false,

  toggleAlive: function() {
    this.alive = !this.alive;
  },

  setNumberOfNeighbors: function(numberOfNeighbors) {
    this.neighbors = numberOfNeighbors;
  },

  determineFate: function() {
    if ((this.neighbors < n2.value) || (this.neighbors > n3.value)) {
      this.alive = false;
    } else if ((this.neighbors === n1.value) ||(this.neighbors === n11.value) || (this.neighbors == n4.value)) { // 
      this.alive = true;
    }
    // if this.neighbors === 2, this.alive doesn't change
  }
};

var Game = {
  createUniverse: function(numberOfRows, numberOfColumns) {
    this.population = 0;
    this.generations = 0;
    this.populationMax = 0;
    this.generationAtPopulationMax = 0;
    this.universe = [];
    for (var row = 0; row < numberOfRows; row++) {
      this.universe.push([]);
      for (var column = 0; column < numberOfColumns; column++) {
        var cell = Object.create(Cell);
        this.universe[row][column] = cell;
      }
    }
  },

  countLivingNeighbors: function(cellRow, cellColumn) {
    var livingNeighbors = 0;
    
    for (var rowIncrement = -1; rowIncrement < 2; rowIncrement++) {
      for (var columnIncrement = -1; columnIncrement < 2; columnIncrement++) {          
        var neighborCell = this.wrapUniverse((cellRow + rowIncrement), (cellColumn + columnIncrement));
        if (this.universe[neighborCell[0]][neighborCell[1]].alive) {
          livingNeighbors++;
        }
      }
    }

    livingNeighbors -= (this.universe[cellRow][cellColumn].alive) ? 1 : 0;

    return livingNeighbors;
  },

  wrapUniverse: function(row, column) {
    if (row === -1) {
      row = this.universe.length - 1;
    } else if (row === this.universe.length) {
      row = 0;
    } 

    if (column === -1) {
      column = this.universe[0].length -1;
    } else if (column === this.universe[0].length) {
      column = 0;
    }

    return [row, column];
  },

  nextGeneration: function() {
    this.population = 0;
    this.generations++;

    for (var row = 0; row < this.universe.length; row++) {
      for (var column = 0; column < this.universe[row].length; column++) {
        this.universe[row][column].setNumberOfNeighbors(this.countLivingNeighbors(row, column));
      }
    }

    for (var row = 0; row < this.universe.length; row++) {
      for (var column = 0; column < this.universe[row].length; column++) {
        this.universe[row][column].determineFate();
        if (this.universe[row][column].alive) {
          this.population++;
        }
      }
    }

    if (this.population > this.populationMax) {
      this.populationMax = this.population;
      this.generationAtPopulationMax = this.generations;
    }
  }
}

$(function() {
  function incrementGeneration() {
    game.nextGeneration();
    $("#generation-counter").empty().append(game.generations);
    $("#population").empty().append(game.population);
    $("#population-max").empty().append(game.populationMax);
    $("#generation-max").empty().append(game.generationAtPopulationMax);
    $(".hiding").show();
    $("#game-grid").removeClass("pad-bottom");
    for (var row = 0; row < gridRows; row++) {
      for (var column = 0; column < gridColumns; column++) {
        if (game.universe[row][column].alive) {
          $("#game-grid tr:nth-of-type(" + (row + 1) + ")").children('td:nth-of-type(' + (column + 1) + ')').removeClass().addClass('alive');
        } else {
          $("#game-grid tr:nth-of-type(" + (row + 1) + ")").children('td:nth-of-type(' + (column + 1) + ')').removeClass();
        }
      }
    }
  }

  function generateTable() {
    for (var row = 0; row < gridRows; row++) {
      $("#game-grid").append("<tr value=" + row + "></tr>");
      for (var column = 0; column < gridColumns; column++) {
        $("#game-grid tr").last().append("<td value=" + column + "></td>");
      }
    }
  }

  var play;
  var gridRows = 30;
  var gridColumns = 30;
  var speed = 400;
  var game = Object.create(Game);
  game.createUniverse(gridRows, gridColumns);
  generateTable();

  var isMouseDown = false;
  $("#game-grid td")
    .mousedown(function () {
      isMouseDown = true;
      var cellRow = $(this).parent().attr("value");
      var cellColumn = $(this).attr("value");
      game.universe[cellRow][cellColumn].toggleAlive();
      $(this).toggleClass("alive");
      return false;
    })
    .mouseover(function () {
      if (isMouseDown) {
        var cellRow = $(this).parent().attr("value");
        var cellColumn = $(this).attr("value");
        game.universe[cellRow][cellColumn].toggleAlive();
        $(this).toggleClass("alive");
      }
    });
  
  $(document)
    .mouseup(function () {
      isMouseDown = false;
    });

  $("#step").click(function() {
    window.clearInterval(play);
    incrementGeneration();
  });

  $("#play").click(function() {
    if (play !== undefined) {
      window.clearInterval(play);
    }
    play = window.setInterval(function() {
      incrementGeneration();
    }, speed);
  });

  $("#pause").click(function() {
    window.clearInterval(play);
  });

  $("#reset").click(function() {
    window.clearInterval(play);
    game.createUniverse(gridRows, gridColumns);
    speed = 400;
    $("td").removeClass();
    $("#generation-counter").empty().append(game.generations);
    $("#population").empty().append(game.population);
    $(".hiding").hide();
    $("#game-grid").addClass("pad-bottom");
  });

  $("#modal-close").click(function() {
    window.clearInterval(play);
    game.createUniverse(gridRows, gridColumns);
    speed = 400;
    $("td").removeClass();
    $("#generation-counter").empty().append(game.generations);
    $("#population").empty().append(game.population);
    $(".hiding").hide();
    $("#game-grid").addClass("pad-bottom");
  });

  $("#rules").click(function() {
    $("#rulesModal").modal("show");
  });

  $("input#speed").change(function() {
    speed = $("#speed").val();
    if (play != undefined) {
      window.clearInterval(play);
      play = window.setInterval(function() {
        incrementGeneration();
      }, speed);
    }
  });

  $("#example").click(function() {
    $(this).addClass("hiding");
    $("#rules-animation").removeClass("hiding");
  });

  // $("#decrease-speed").click(function () {
  //   if (play !== undefined) {
  //     window.clearInterval(play);
  //     speed += 100;
  //     play = window.setInterval(function() {
  //       incrementGeneration();
  //     }, speed);
  //   }
  // });

  // $("#increase-speed").click(function () {
  //   if (play !== undefined) {
  //     window.clearInterval(play);
  //     if (speed > 100) {
  //     speed -= 100;
  //     }
  //     play = window.setInterval(function() {
  //       incrementGeneration();
  //     }, speed);
  //   }
  // });
});