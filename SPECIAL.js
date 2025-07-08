const recommendedpuzzles = [{author: "intro_puzzle_bot", emoji: "🤖", puzzles: ['1234', '4211', '1111', '6072', '0612', '5095', '3004', '8432']}, 
    {author: "fluff", emoji: "⭐", puzzles: ['0003', '0004', '0300', '1254', '2253', '2551', '3451', '3565', '2542', '3332', '4367', '4658', '4851', '5246', '7585', '8235', '8456']}, 
    {author: "phenomist", emoji: "🌁", puzzles: ['9598', '9958', '3495', '8656', '2868', '7537', '7556', '4898', '4394', '8951', '5694', '4955', '3955', '6869', '8519']}, 
    {author: "abiteofdata", emoji: "🦎", puzzles: ['1196', '7800', '7333', '5257', '7588']}, 
    {author: "n3rl", emoji: "🦐", puzzles: ['9387']},
    {author: "elara", emoji: "⛰️", puzzles: ['5998', '4908']}]
const challenge = [{puz: '1254', restrictions: '+-'}, 
    {puz: '3332', restrictions: '+-'}, 
    {puz: '8235', restrictions: '+-'}, 
    {puz: '8432', restrictions: '+-'}, 
    {puz: '3495', restrictions: '+-'}, 
    {puz: '9598', restrictions: '+-'}, 
    {puz: '7585', restrictions: '-'}, 
    {puz: '8951', restrictions: '^!'}, 
    {puz: '5998', restrictions: '/'}, 
    {puz: '7333', restrictions: '+-'},
    {puz: '8519', restrictions: '^'}]
const DEFAULT_SETTINGS = "00000000" // unsolved, completed, recommended, random, has-challenge, includerandom, multisolve, openinsandbox

const LEADERBOARD = [
    ["phenomist;6/17/2025"],
    ["phenomist;6/10/2025", "elara;6/15/2025", "abiteofdata;6/15/2025"],
    ["elara;6/8/2025", "phenomist;6/9/2025", "abiteofdata;6/15/2025", "mlemth;6/17/2025", "MTFlowCzq;7/8/2025"],
    ["elara;6/6/2025", "phenomist;6/6/2025", "mlemth;6/11/2025", "abiteofdata;6/12/2025", "fluff;6/12/2025", "MTFlowCzq;6/21/2025"]
] 
