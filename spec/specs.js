describe("GameOfLife", function() {
  describe("Cell", function() {
    it("starts not alive", function() {
      var cell = Object.create(Cell);
      cell.alive.should.be.false;
    });

    describe("toggleAlive", function() {
      it("changes a not alive cell to alive", function() {
        var cell = Object.create(Cell);
        cell.toggleAlive();
        cell.alive.should.be.true;
      });

      it("changes an alive cell to not alive", function() {
        var cell = Object.create(Cell);
        cell.toggleAlive();
        cell.toggleAlive();
        cell.alive.should.be.false;
      });
    });

    describe("setNumberOfNeighbors", function() {
      it("sets the number of neighbors", function() {
        var cell = Object.create(Cell);
        cell.setNumberOfNeighbors(5);
        cell.neighbors.should.equal(5);
      });
    });

    describe("determineFate", function() {
      it("dies if it has less than two neighbors", function() {
        var cell = Object.create(Cell);
        cell.toggleAlive();
        cell.setNumberOfNeighbors(1);
        cell.determineFate();
        cell.alive.should.be.false;
      });

      it("dies if it has more than three neighbors", function() {
        var cell = Object.create(Cell);
        cell.toggleAlive();
        cell.setNumberOfNeighbors(5);
        cell.determineFate();
        cell.alive.should.be.false;
      });

      it("becomes alive if it has exactly three neighbors", function() {
        var cell = Object.create(Cell);
        cell.setNumberOfNeighbors(3);
        cell.determineFate();
        cell.alive.should.be.true;
      });
    });
  });

  describe("Game", function() {
    describe("createUniverse", function() {
      it("creates an array of cells", function() {
        var game = Object.create(Game);
        game.createUniverse(2, 2);
        game.universe[1][1].alive.should.be.false;
      });

      it("sets a variable for total population to 0", function() {
        var game = Object.create(Game);
        game.createUniverse(2, 2);
        game.population.should.equal(0);
      });

      it("sets a variable for number of generations to 0", function() {
        var game = Object.create(Game);
        game.createUniverse(2, 2);
        game.generations.should.equal(0);
      });

      it("sets a variable for highest population to 0", function() {
        var game = Object.create(Game);
        game.createUniverse(2, 2);
        game.populationMax.should.equal(0);
      });

      it("sets a variable for generation number at highest population to 0", function() {
        var game = Object.create(Game);
        game.createUniverse(2, 2);
        game.generationAtPopulationMax.should.equal(0);
      });
    });

    describe("countLivingNeighbors", function() {
      it("counts the number of living neighbors for a position in the universe array", function() {
        var game = Object.create(Game);
        game.createUniverse(3, 3);
        game.universe[1][2].toggleAlive();
        game.countLivingNeighbors(1, 1).should.equal(1);
      });

      it("counts the number of living neighbors for a position in the universe array, excluding the called position", function() {
        var game = Object.create(Game);
        game.createUniverse(3, 3);
        game.universe[1][2].toggleAlive();
        game.universe[1][1].toggleAlive();
        game.countLivingNeighbors(1, 1).should.equal(1);
      });

      it("counts the number of living neighbors for a position at the left edge of a universe array", function() {
        var game = Object.create(Game);
        game.createUniverse(3, 3);
        game.universe[1][1].toggleAlive();
        game.countLivingNeighbors(1, 0).should.equal(1);
      });

      it("counts the number of living neighbors for a position at the right edge of a universe array", function() {
        var game = Object.create(Game);
        game.createUniverse(3, 3);
        game.universe[0][2].toggleAlive();
        game.countLivingNeighbors(1, 2).should.equal(1);
      });

      it("counts the number of living neighbors for a position at the top of a universe array", function() {
        var game = Object.create(Game);
        game.createUniverse(3, 3);
        game.universe[1][1].toggleAlive();
        game.countLivingNeighbors(0, 1).should.equal(1);
      });

      it("counts the number of living neighbors for a position at the bottom of a universe array", function() {
        var game = Object.create(Game);
        game.createUniverse(3, 3);
        game.universe[1][1].toggleAlive();
        game.countLivingNeighbors(2, 1).should.equal(1);
      });
    });

    describe("wrapUniverse", function() {
      it("changes a row index of -1 to the last index of the array (array.length - 1)", function() {
        var game = Object.create(Game);
        game.createUniverse(5, 5);
        game.wrapUniverse(-1, 3).should.eql([4, 3])
      });

      it("returns a row index of 0 if the input row index is greater than the last index in the array", function() {
        var game = Object.create(Game);
        game.createUniverse(5, 5);
        game.wrapUniverse(5, 2).should.eql([0, 2]);
      });

      it("changes a column index of -1 to the last index of the array (array[0].length - 1)", function() {
        var game = Object.create(Game);
        game.createUniverse(5, 5);
        game.wrapUniverse(3, -1).should.eql([3, 4]);
      });

      it("returns a column index of 0 if the input column index is greater than the last index in the array", function() {
        var game = Object.create(Game);
        game.createUniverse(5,5);
        game.wrapUniverse(3, 5).should.eql([3, 0]);
      });
    });

    describe("nextGeneration", function() {
      it("determines number of neighbors for each cell in the universe", function() {
        var game = Object.create(Game);
        game.createUniverse(3, 3);
        game.universe[1][0].toggleAlive();
        game.universe[1][2].toggleAlive();
        game.universe[2][1].toggleAlive();
        game.nextGeneration();
        game.universe[1][1].neighbors.should.equal(3);
      });

      it("changes the 'alive' state of each cell based on their new fate", function() {
        var game = Object.create(Game);
        game.createUniverse(3, 3);
        game.universe[1][0].toggleAlive();
        game.universe[1][2].toggleAlive();
        game.universe[2][1].toggleAlive();
        game.nextGeneration();
        game.universe[1][1].alive.should.be.true;
      });

      it("sets the population counter equal to the number of cells alive after determining fate", function() {
        var game = Object.create(Game);
        game.createUniverse(10, 10);
        game.universe[1][0].toggleAlive();
        game.universe[1][2].toggleAlive();
        game.universe[2][1].toggleAlive();
        game.nextGeneration();
        game.population.should.equal(2);
      });

      it("increments the generation counter by 1", function() {
        var game = Object.create(Game);
        game.createUniverse(5, 5);
        game.nextGeneration();
        game.generations.should.equal(1);
      });

      it("sets the highest population equal to the current population if current population is highest so far", function () {
        var game = Object.create(Game);
        game.createUniverse(5, 5);
        game.universe[1][0].toggleAlive();
        game.universe[1][2].toggleAlive();
        game.universe[2][1].toggleAlive();
        game.nextGeneration();
        game.populationMax.should.equal(2);
      });

      it("sets the generation at highest population equal to the current generation if current population is highest so far", function () {
        var game = Object.create(Game);
        game.createUniverse(5, 5);
        game.universe[1][0].toggleAlive();
        game.universe[1][2].toggleAlive();
        game.universe[2][1].toggleAlive();
        game.nextGeneration();
        game.generationAtPopulationMax.should.equal(1);
      });
    });
  });
});



