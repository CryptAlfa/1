
var is_node = true;

try {
  is_node = typeof process == 'object'
} catch (e) {
  is_node = false;
}

if (is_node) { 
  var sys = require('sys'),
       ch = require('../chess');

  var log = sys.puts;
  var Chess = ch.Chess;
} else {
  var log = function(text, newline) {
    var console = document.getElementById('console');
    console.innerHTML += text;
    if (typeof newline  == 'undefined' || newline == true) {
      console.innerHTML += '<br />';
    }
  }
}

function perft_unit_tests() {
  var chess = new Chess();
  var start = new Date;
  var perfts = [
    {fen: 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1', 
      depth: 3, nodes: 97862},
    {fen: '8/PPP4k/8/8/8/8/4Kppp/8 w - - 0 1',
      depth: 4, nodes: 89363},
    {fen: '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1',
      depth: 4, nodes: 43238},
    {fen: 'rnbqkbnr/p3pppp/2p5/1pPp4/3P4/8/PP2PPPP/RNBQKBNR w KQkq b6 0 4',
      depth: 3, nodes: 23509},
  ];

  var total_nodes = 0;
  for (var i = 0; i < perfts.length; i++) {
    chess.load(perfts[i].fen);
    var nodes = chess.perft(perfts[i].depth);
    var s = 'Perft Test #' + i + ': ' + perfts[i].fen + ' - ' + nodes + ' : ';
    s += (nodes != perfts[i].nodes) ? 'FAILED!' : 'PASSED!';
    total_nodes += nodes;
    log(s);
  }
  var finish = new Date;
  var diff = (finish - start) / 1000;

  log('--> Perft Time: ' + diff + ' secs ' + '(' + Math.floor(total_nodes / diff) + ' NPS)');
  log('');
}

function checkmate_unit_tests() {
  var chess = new Chess();
  var start = new Date;
  var checkmates = [
    '8/5r2/4K1q1/4p3/3k4/8/8/8 w - - 0 7',
    '4r2r/p6p/1pnN2p1/kQp5/3pPq2/3P4/PPP3PP/R5K1 b - - 0 2',
    'r3k2r/ppp2p1p/2n1p1p1/8/2B2P1q/2NPb1n1/PP4PP/R2Q3K w kq - 0 8',
    '8/6R1/pp1r3p/6p1/P3R1Pk/1P4P1/7K/8 b - - 0 4',
  ]

  for (var i = 0; i < checkmates.length; i++) {
    chess.load(checkmates[i]);
    var s = 'Checkmate Test #' + i + ': ' + checkmates[i] + ' : ';
    s += (chess.in_checkmate()) ? 'PASSED!' : 'FAILED!';
    log(s);
  }

  var finish = new Date;
  var diff = (finish - start) / 1000;
  log('--> Checkmate Time: ' + diff + ' secs');
  log('');
}

function stalemate_unit_tests() {
  var chess = new Chess();
  var start = new Date;
  var stalemates = [
    '1R6/8/8/8/8/8/7R/k6K b - - 0 1',
    '8/8/5k2/p4p1p/P4K1P/1r6/8/8 w - - 0 2',
  ];

  for (var i = 0; i < stalemates.length; i++) {
    chess.load(stalemates[i]);
    var s = 'Stalemate Test #' + i + ': ' + stalemates[i] + ' : ';
    s += (chess.in_stalemate()) ? 'PASSED!' : 'FAILED!';
    log(s);
  }
  var finish = new Date;
  var diff = (finish - start) / 1000;
  log('--> Stalemate Time: ' + diff + ' secs');
  log('');
}

function insufficient_material_unit_test() {
  var chess = new Chess();
  var start = new Date;
  var positions = [
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', draw: false},
    {fen: '8/8/8/8/8/8/8/k6K w - - 0 1', draw: true},
    {fen: '8/2p5/8/8/8/8/8/k6K w - - 0 1', draw: false},
    {fen: '8/2N5/8/8/8/8/8/k6K w - - 0 1', draw: true},
    {fen: '8/2b5/8/8/8/8/8/k6K w - - 0 1', draw: true},
  ];

  for (var i = 0; i < positions.length; i++) {
    chess.load(positions[i].fen);
    var s = 'Insufficient Material Test #' + i + ': ' + positions[i].fen + ' : ';
    if (positions[i].draw) {
      s += (chess.insufficient_material() && chess.in_draw()) ? 'PASSED!' : 'FAILED!';
    } else {
      s += (!chess.insufficient_material() && !chess.in_draw()) ? 'PASSED!' : 'FAILED!';
    }

    log(s);
  }
  var finish = new Date;
  var diff = (finish - start) / 1000;
  log('--> Insufficient Material Time: ' + diff + ' secs');
  log('');
}

function threefold_repetition_unit_test() {
  var chess = new Chess();
  var start = new Date;
  var positions = [
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 
     moves: ['Nf3', 'Nf6', 'Ng1', 'Ng8', 'Nf3', 'Nf6', 'Ng1', 'Ng8']},

    /* Fischer - Petrosian, Buenos Aires, 1971 */
    {fen: '8/pp3p1k/2p2q1p/3r1P2/5R2/7P/P1P1QP2/7K b - - 2 30',
     moves: ['Qe5', 'Qh5', 'Qf6', 'Qe2', 'Re5', 'Qd3', 'Rd5', 'Qe2']},
  ];

  for (var i = 0; i < positions.length; i++) {
    chess.load(positions[i].fen);
    var s = 'Threefold Repetition Test #' + i + ': ' + positions[i].fen + ' : ';
    var passed = true;
    for (var j = 0; j < positions[i].moves.length; j++) {
      if (chess.in_threefold_repetition()) {
        passed = false;
        break;
      }
      chess.move(positions[i].moves[j]);
    }

    if (!passed) {
      s += 'FAILED!'; 
    } else {
      s += (chess.in_threefold_repetition() && chess.in_draw()) ? 'PASSED!' : 'FAILED!';
    }

    log(s);
  }
  var finish = new Date;
  var diff = (finish - start) / 1000;
  log('--> Threefold Repetition Time: ' + diff + ' secs');
  log('');
}

function algebraic_notation_tests() {
  var chess = new Chess();
  var start = new Date;
  var passed = true;
  var positions = [
    {fen: '7k/3R4/3p2Q1/6Q1/2N1N3/8/8/3R3K w - - 0 1', 
     moves: ['Rd8#', 'Re7', 'Rf7', 'Rg7', 'Rh7#', 'R7xd6', 'Rc7', 'Rb7', 'Ra7',
             'Qf7', 'Qe8#', 'Qg7#', 'Qg8#', 'Qh7#', 'Q6h6#', 'Q6h5#', 'Q6f5',
             'Q6f6#', 'Qe6', 'Qxd6', 'Q5f6#', 'Qe7', 'Qd8#', 'Q5h6#', 'Q5h5#',
             'Qh4#', 'Qg4', 'Qg3', 'Qg2', 'Qg1', 'Qf4', 'Qe3', 'Qd2', 'Qc1',
             'Q5f5', 'Qe5+', 'Qd5', 'Qc5', 'Qb5', 'Qa5', 'Na5', 'Nb6', 'Ncxd6',
             'Ne5', 'Ne3', 'Ncd2', 'Nb2', 'Na3', 'Nc5', 'Nexd6', 'Nf6', 'Ng3',
             'Nf2', 'Ned2', 'Nc3', 'Rd2', 'Rd3', 'Rd4', 'Rd5', 'R1xd6', 'Re1',
             'Rf1', 'Rg1', 'Rc1', 'Rb1', 'Ra1', 'Kg2', 'Kh2', 'Kg1']},
    {fen: '1r3k2/P1P5/8/8/8/8/8/R3K2R w KQ - 0 1',
     moves: ['a8=Q', 'a8=R', 'a8=B', 'a8=N', 'axb8=Q+', 'axb8=R+', 'axb8=B',
             'axb8=N', 'c8=Q+', 'c8=R+', 'c8=B', 'c8=N', 'cxb8=Q+', 'cxb8=R+',
             'cxb8=B', 'cxb8=N', 'Ra2', 'Ra3', 'Ra4', 'Ra5', 'Ra6', 'Rb1', 
             'Rc1', 'Rd1', 'Kd2', 'Ke2', 'Kf2', 'Kf1', 'Kd1', 'Rh2', 'Rh3',
             'Rh4', 'Rh5', 'Rh6', 'Rh7', 'Rh8+', 'Rg1', 'Rf1+', 'O-O+',
             'O-O-O']},
    {fen: '5rk1/8/8/8/8/8/2p5/R3K2R w KQ - 0 1',
     moves: ['Ra2', 'Ra3', 'Ra4', 'Ra5', 'Ra6', 'Ra7', 'Ra8', 'Rb1', 'Rc1',
             'Rd1', 'Kd2', 'Ke2', 'Rh2', 'Rh3', 'Rh4', 'Rh5', 'Rh6', 'Rh7',
             'Rh8+', 'Rg1+', 'Rf1']},
    {fen: '5rk1/8/8/8/8/8/2p5/R3K2R b KQ - 0 1',
     moves: ['Rf7', 'Rf6', 'Rf5', 'Rf4', 'Rf3', 'Rf2', 'Rf1+', 'Re8+', 'Rd8',
             'Rc8', 'Rb8', 'Ra8', 'Kg7', 'Kf7', 'c1=Q+', 'c1=R+', 'c1=B',
             'c1=N']},
    {fen: 'r3k2r/p2pqpb1/1n2pnp1/2pPN3/1p2P3/2N2Q1p/PPPB1PPP/R3K2R w KQkq c6 0 2',
     moves: ['gxh3', 'Qxf6', 'Qxh3', 'Nxd7', 'Nxf7', 'Nxg6', 'dxc6', 'dxe6',
             'Rg1', 'Rf1', 'Ke2', 'Kf1', 'Kd1', 'Rb1', 'Rc1', 'Rd1', 'g3',
             'g4', 'Be3', 'Bf4', 'Bg5', 'Bh6', 'Bc1', 'b3', 'a3', 'a4', 'Qf4',
             'Qf5', 'Qg4', 'Qh5', 'Qg3', 'Qe2', 'Qd1', 'Qe3', 'Qd3', 'Na4',
             'Nb5', 'Ne2', 'Nd1', 'Nb1', 'Nc6', 'Ng4', 'Nd3', 'Nc4', 'd6',
             'O-O', 'O-O-O']},
    {fen: 'k7/8/K7/8/3n3n/5R2/3n4/8 b - - 0 1',
     moves: ['N2xf3', 'Nhxf3', 'Nd4xf3', 'N2b3', 'Nc4', 'Ne4', 'Nf1', 'Nb1',
             'Nhf5', 'Ng6', 'Ng2', 'Nb5', 'Nc6', 'Ne6', 'Ndf5', 'Ne2', 'Nc2',
             'N4b3', 'Kb8']},
    ];

  for (var i = 0; i < positions.length; i++) { 
    var s = 'Algebraic Notation Test #' + i + ': ' + positions[i].fen + ' : ';
    chess.load(positions[i].fen);
    var moves = chess.moves();
    if (moves.length != positions[i].moves.length) {
      passed = false;
    } else {
      for (var j = 0; j < moves.length; j++) {
        if (positions[i].moves.indexOf(moves[j]) == -1) {
          passed = false;
          break; 
        } 
      } 
    }
    s += passed ? 'PASSED!' : 'FAILED!';
    log(s);
  }

  var finish = new Date;
  var diff = (finish - start) / 1000;
  log('--> Algebraic Notation Time: ' + diff + ' secs');
  log('');
}

function get_put_remove_tests() {
  var chess = new Chess();
  var start = new Date;
  var passed = true;
  var positions = [
    {pieces: {a7: {type: chess.PAWN, color: chess.WHITE},
              b7: {type: chess.PAWN, color: chess.BLACK},
              c7: {type: chess.KNIGHT, color: chess.WHITE},
              d7: {type: chess.KNIGHT, color: chess.BLACK},
              e7: {type: chess.BISHOP, color: chess.WHITE},
              f7: {type: chess.BISHOP, color: chess.BLACK},
              g7: {type: chess.ROOK, color: chess.WHITE},
              h7: {type: chess.ROOK, color: chess.BLACK},
              a6: {type: chess.QUEEN, color: chess.WHITE},
              b6: {type: chess.QUEEN, color: chess.BLACK},
              a4: {type: chess.KING, color: chess.WHITE},
              h4: {type: chess.KING, color: chess.BLACK}},
     should_pass: true},

    {pieces: {a7: {type: 'z', color: chess.WHTIE}}, // bad piece
     should_pass: false},

    {pieces: {j4: {type: chess.PAWN, color: chess.WHTIE}}, // bad square
     should_pass: false},
  ];

  for (var i = 0; i < positions.length; i++) {
    passed = true;
    chess.clear();
    var s = 'Get/Put Test #' + i + ' (' + positions[i].should_pass + '): ';

    /* places the pieces */
    for (var square in positions[i].pieces) {
      passed &= chess.put(positions[i].pieces[square], square);
    }

    /* iterate over every square to make sure get returns the proper
     * piece values/color 
     */
    for (var j = 0; j < chess.SQUARES.length; j++) {
      var square = chess.SQUARES[j];
      if (!(square in positions[i].pieces)) {
        if (chess.get(square)) {
          passed = false;
          break;
        }
      } else {
        var piece = chess.get(square);
        if (!(piece &&
            piece.type == positions[i].pieces[square].type &&
            piece.color == positions[i].pieces[square].color)) {
          passed = false;
          break;
        }
      }
    }

    if (passed) {
      /* remove the pieces */
      for (var j = 0; j < chess.SQUARES.length; j++) {
        var square = chess.SQUARES[j];
        var piece = chess.remove(square);
        if ((!(square in positions[i].pieces)) && piece) {
          passed = false;
          break;
        }

        if (piece &&
           (positions[i].pieces[square].type != piece.type ||
            positions[i].pieces[square].color != piece.color)) {
          passed = false;
          break;
        }
      }
    }

    /* finally, check for an empty board */
    passed = passed && (chess.fen() == '8/8/8/8/8/8/8/8 w - - 0 1');

    /* some tests should fail, so make sure we're supposed to pass/fail each
     * test
     */
    passed = (passed == positions[i].should_pass);

    s += passed ? 'PASSED!' : 'FAILED!';

    log(s);
  }
  var finish = new Date;
  var diff = (finish - start) / 1000;
  log('--> Get/Put Time: ' + diff + ' secs');
  log('');
}

function fen_tests() {
  var chess = new Chess();
  var start = new Date;
  var passed = true;
  var positions = [
    {fen: '8/8/8/8/8/8/8/8 w - - 0 1', should_pass: true},
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', should_pass: true},
    {fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', should_pass: true},
    {fen: '1nbqkbn1/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/1NBQKBN1 b - - 1 2', should_pass: true},

    /* incomplete FEN string */
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN w KQkq - 0 1', should_pass: false},

    /* bad digit (9)*/
    {fen: 'rnbqkbnr/pppppppp/9/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', should_pass: false},

    /* bad piece (X)*/
    {fen: '1nbqkbn1/pppp1ppX/8/4p3/4P3/8/PPPP1PPP/1NBQKBN1 b - - 1 2', should_pass: false},
  ];

  for (var i = 0; i < positions.length; i++) {
    passed = true;
    chess.load(positions[i].fen);
    var s = 'FEN Test #' + i + ': ' + positions[i].fen + ' (' + positions[i].should_pass + '): ';
    passed = (chess.fen() == positions[i].fen == positions[i].should_pass);
    s += (passed) ? 'PASSED!' : 'FAILED!';
    log(s);
  }
  var finish = new Date;
  var diff = (finish - start) / 1000;
  log('--> FEN Time: ' + diff + ' secs');
  log('');
}

function pgn_tests() {
  var start = new Date;
  var passed = true;
	var error_message;
  var positions = [
    {moves: ['d4', 'd5', 'Nf3', 'Nc6', 'e3', 'e6', 'Bb5', 'g5', 'O-O', 'Qf6', 'Nc3',
             'Bd7', 'Bxc6', 'Bxc6', 'Re1', 'O-O-O', 'a4', 'Bb4', 'a5', 'b5', 'axb6', 
             'axb6', 'Ra8+', 'Kd7', 'Ne5+', 'Kd6', 'Rxd8+', 'Qxd8', 'Nxf7+', 'Ke7', 
             'Nxd5+', 'Qxd5', 'c3', 'Kxf7', 'Qf3+', 'Qxf3', 'gxf3', 'Bxf3', 'cxb4', 
             'e5', 'dxe5', 'Ke6', 'b3', 'Kxe5', 'Bb2+', 'Ke4', 'Bxh8', 'Nf6', 'Bxf6', 
             'h5', 'Bxg5', 'Bg2', 'Kxg2', 'Kf5', 'Bh4', 'Kg4', 'Bg3', 'Kf5', 'e4+', 
             'Kg4', 'e5', 'h4', 'Bxh4', 'Kxh4', 'e6', 'c5', 'bxc5', 'bxc5', 'e7', 'c4', 
             'bxc4', 'Kg4', 'e8=Q', 'Kf5', 'Qe5+', 'Kg4', 'Re4#'],
     info: ['White', 'Jeff Hlywa', 'Black', 'Steve Bragg', 'GreatestGameEverPlayed?', 'True'],
     max_width:19,
     newline_char:"<br />",
     pgn: '[White "Jeff Hlywa"]<br />[Black "Steve Bragg"]<br />[GreatestGameEverPlayed? "True"]<br /><br />1. d4 d5 2. Nf3 Nc6<br />3. e3 e6 4. Bb5 g5<br />5. O-O Qf6<br />6. Nc3 Bd7<br />7. Bxc6 Bxc6<br />8. Re1 O-O-O<br />9. a4 Bb4 10. a5 b5<br />11. axb6 axb6<br />12. Ra8+ Kd7<br />13. Ne5+ Kd6<br />14. Rxd8+ Qxd8<br />15. Nxf7+ Ke7<br />16. Nxd5+ Qxd5<br />17. c3 Kxf7<br />18. Qf3+ Qxf3<br />19. gxf3 Bxf3<br />20. cxb4 e5<br />21. dxe5 Ke6<br />22. b3 Kxe5<br />23. Bb2+ Ke4<br />24. Bxh8 Nf6<br />25. Bxf6 h5<br />26. Bxg5 Bg2<br />27. Kxg2 Kf5<br />28. Bh4 Kg4<br />29. Bg3 Kf5<br />30. e4+ Kg4<br />31. e5 h4<br />32. Bxh4 Kxh4<br />33. e6 c5<br />34. bxc5 bxc5<br />35. e7 c4<br />36. bxc4 Kg4<br />37. e8=Q Kf5<br />38. Qe5+ Kg4<br />39. Re4#',
     fen: '8/8/8/4Q3/2P1R1k1/8/5PKP/8 b - - 4 39'},
    {moves: ['c4', 'e6', 'Nf3', 'd5', 'd4', 'Nf6', 'Nc3', 'Be7', 'Bg5', 'O-O', 'e3', 'h6',
             'Bh4', 'b6', 'cxd5', 'Nxd5', 'Bxe7', 'Qxe7', 'Nxd5', 'exd5', 'Rc1', 'Be6',
             'Qa4', 'c5', 'Qa3', 'Rc8', 'Bb5', 'a6', 'dxc5', 'bxc5', 'O-O', 'Ra7',
             'Be2', 'Nd7', 'Nd4', 'Qf8', 'Nxe6', 'fxe6', 'e4', 'd4', 'f4', 'Qe7',
             'e5', 'Rb8', 'Bc4', 'Kh8', 'Qh3', 'Nf8', 'b3', 'a5', 'f5', 'exf5',
             'Rxf5', 'Nh7', 'Rcf1', 'Qd8', 'Qg3', 'Re7', 'h4', 'Rbb7', 'e6', 'Rbc7',
             'Qe5', 'Qe8', 'a4', 'Qd8', 'R1f2', 'Qe8', 'R2f3', 'Qd8', 'Bd3', 'Qe8',
             'Qe4', 'Nf6', 'Rxf6', 'gxf6', 'Rxf6', 'Kg8', 'Bc4', 'Kh8', 'Qf4'],
     info: ["Event", "Reykjavik WCh", "Site", "Reykjavik WCh", "Date", "1972.01.07", "EventDate", "?", "Round", "6", "Result", "1-0",
            "White", "Robert James Fischer", "Black", "Boris Spassky", "ECO", "D59", "WhiteElo", "?", "BlackElo", "?", "PlyCount", "81"],
     max_width:65,
     pgn: '[Event "Reykjavik WCh"]\n[Site "Reykjavik WCh"]\n[Date "1972.01.07"]\n[EventDate "?"]\n[Round "6"]\n[Result "1-0"]\n[White "Robert James Fischer"]\n[Black "Boris Spassky"]\n[ECO "D59"]\n[WhiteElo "?"]\n[BlackElo "?"]\n[PlyCount "81"]\n\n1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6\n7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6\n12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7\n17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21. f4 Qe7\n22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5\n27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7\n32. Qe5 Qe8 33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8\n37. Qe4 Nf6 38. Rxf6 gxf6 39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4',
     fen: '4q2k/2r1r3/4PR1p/p1p5/P1Bp1Q1P/1P6/6P1/6K1 b - - 4 41'},
    {moves: ['f3', 'e5', 'g4', 'Qh4#'],     // testing max_width being small and having no comments
     info: [],
     max_width:1,
     pgn: '1. f3 e5\n2. g4 Qh4#',
     fen: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3'},
    {moves: ['Ba5', 'O-O', 'd6', 'd4'],     // testing a non-starting position
     info: [],
     max_width:20,
     pgn: '[SetUp "r1bqk1nr/pppp1ppp/2n5/4p3/1bB1P3/2P2N2/P2P1PPP/RNBQK2R b KQkq - 0 1"]\n[FEN "1"]\n\n1. ... Ba5 2. O-O d6\n3. d4',
     starting_position: 'r1bqk1nr/pppp1ppp/2n5/4p3/1bB1P3/2P2N2/P2P1PPP/RNBQK2R b KQkq - 0 1',
     fen: 'r1bqk1nr/ppp2ppp/2np4/b3p3/2BPP3/2P2N2/P4PPP/RNBQ1RK1 b kq d3 0 3'}
    ];
  for (var i = 0; i < positions.length; i++) {
    var chess = ("starting_position" in positions[i]) ? new Chess(positions[i].starting_position) : new Chess();
    // var chess = (positions.starting_position !== undefined) ? new Chess(positions.starting_position) : new Chess();
    passed = true;
		error_message = "";
    for (var j = 0; j < positions[i].moves.length; j++) {
			if (chess.move(positions[i].moves[j]) === null) {
				error_message = "move() did not accept " + positions[i].moves[j] + " : ";
				break;
			}
    }
    var s = 'PGN Test #' + i + ': ' + error_message;
    chess.info.apply(null, positions[i].info);
    var pgn = chess.pgn({max_width:positions[i].max_width, newline_char:positions[i].newline_char});
    var fen = chess.fen();
    passed = pgn === positions[i].pgn && fen === positions[i].fen;
    s += (passed) ? 'PASSED!' : 'FAILED!';
    log(s);
  }
  var finish = new Date;
  var diff = (finish-start) / 1000;
  log('--> PGN Time: ' + diff + ' secs');
  log('');
}
      
function make_move_tests() {
  var chess = new Chess();
  var start = new Date;
  var positions = [
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
     legal: true,
     move: 'e4',
     next: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'},
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
     legal: false,
     move: 'e5'},
    {fen: '7k/3R4/3p2Q1/6Q1/2N1N3/8/8/3R3K w - - 0 1',
     legal: true,
     move: 'Rd8#',
     next: '3R3k/8/3p2Q1/6Q1/2N1N3/8/8/3R3K b - - 1 1'},
    {fen: 'rnbqkbnr/pp3ppp/2pp4/4pP2/4P3/8/PPPP2PP/RNBQKBNR w KQkq e6 0 1',
     legal: true,
     move: 'fxe6',
     next: 'rnbqkbnr/pp3ppp/2ppP3/8/4P3/8/PPPP2PP/RNBQKBNR b KQkq - 0 1'}
  ];

  for (var i = 0; i < positions.length; i++) {
    chess.load(positions[i].fen);
    var s = 'Make Move Test #' + i + ': ' + positions[i].fen + 
            ' (' + positions[i].move + ' ' + positions[i].legal + ') : ';
    result = chess.move(positions[i].move);
    if (positions[i].legal) {
      s += (result && chess.fen() == positions[i].next) ? 'PASSED!' : 'FAILED!';
    } else {
      s += (!result) ? 'PASSED!' : 'FAILED!';
    }

    log(s);
  }
  var finish = new Date;
  var diff = (finish - start) / 1000;
  log('--> Make Move Time: ' + diff + ' secs');
  log('');
}

function run_unit_tests() {
  var start = new Date;

  if (!is_node) {
    var console = document.getElementById('console');

    if (console == null) {
      alert('Can\'t locate console.  Aborting.');
      return
    }
  }

  perft_unit_tests();
  checkmate_unit_tests();
  stalemate_unit_tests();
  insufficient_material_unit_test();
  threefold_repetition_unit_test();
  algebraic_notation_tests();
  get_put_remove_tests();
  fen_tests();
  pgn_tests();
  make_move_tests();

  var finish = new Date;
  var diff = (finish - start) / 1000;
  log('Total Time: ' + diff + ' secs');
}

if (is_node) {
  run_unit_tests();
}

