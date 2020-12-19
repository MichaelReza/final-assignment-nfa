// A -[0]-> B
// A -[0]-> AB

class State {
    constructor(stateName, accepted) { 
        this.stateName = stateName 
        // dictionary of State objects
        this.zero = {}
        this.one = {}
        this.lambda = {}
        this.accepted = accepted
    }

    addTransition(transition, destination, state) {
        switch (transition) {
            case '0': this.zero[destination] = state; break
            case '1': this.one[destination] = state; break
            case 'lambda': this.lambda[destination] = state; break
            default: throw `Sorry ${transition} is not a valid transition`
        } 
    }

    toString() { 
        let transitions = Array.of(this.zero, this.one, this.lambda)
        let currentState = this.stateName + ((this.accepted) ? "*" : "")
        let destinationState
        for (let i = 0; i < 3; i++) {
            for (let stateName in transitions[i]) {
                destinationState = stateName + ((transitions[i][stateName].accepted) ? "*" : "")
                if (i < 2) {
                    console.log(`  ${currentState} -[${i}]-> ${destinationState}`)
                } else {
                    console.log(`  ${currentState} -[lambda]-> ${destinationState}`)
                } 
            }
        }
    }

    checkTransitionMembership(transition, state) {
        let dictionary = (transition === "0") ? this.zero : (transition === "1") ? this.one : this.lambda
        return state in dictionary
    }
}

class NFA {
    constructor() { 
        this.states = {}
        this.startState = null
    }

    addState(stateObject) {
        if (Object.keys(this.states).length === 0) this.startState = stateObject
        this.states[stateObject.stateName] = stateObject
    }

    toString() {
        for (let state in this.states) {
            state.toString()
        }
    }

    clearAll() {
        this.states = {}
        console.log("All states have been cleared...\n\n")
    }

    handleStates (input) {
        let origin = /^(.*)\s-/.exec(input)[1]
        let transition = /\[(.*?)\]/.exec(input)[1]
        let destination = />\s(.*)$/.exec(input)[1]
        let originAccept = origin[origin.length - 1] === '*'
        let destinationAccept = destination[destination.length - 1] === '*'
        
        if (originAccept) origin = origin.substring(0, origin.length - 1)
        if (destinationAccept) destination = destination.substring(0, destination.length - 1)

        if ((origin in this.states) && (destination in this.states)) {
            this.states[origin].checkTransitionMembership(transition, destination) ? 
                console.log("These states and this transition already exist") : 
                console.log(`1 transition created -> ([${transition}]-> ${destination})\n
                        \nKeep going or choose one of the following options:`)
        } else if ((origin in this.states) && !(destination in this.states)){
            console.log(`Adding Transition to ${origin}`)
            console.log(`1 state created -> (${destination})\n\nKeep going or choose one of the following options:`)
            this.states[destination] = new State(destination, destinationAccept)
    
        } else if ((!origin in this.states) && (destination in this.states)) {
            console.log(`1 state created -> (${origin})`)
            console.log(`1 transition created -> ([${transition}]-> ${destination})\n\nKeep going or choose one of the following options:`)
            this.states[origin] = new State(origin, originAccept)
        } else {
            console.log(`2 states created -> (${origin}, ${destination})`)
            console.log(`1 transition created -> ([${transition}]-> ${destination})\n\nKeep going or choose one of the following options:`)
            this.addState(new State(origin, originAccept))
            this.addState(new State(destination, destinationAccept))
        }
        // Create transition if it doesn'nt exist already 
        this.states[origin].addTransition(transition, destination, this.states[destination])
        console.log("\n\\query  -> Start querying \
                     \n\\l    -> list of states w/ transitions\n\n")
    }
    
    validateAndFormat (query) {
        let openParentheses = 0
        let closeParentheses = 0
        let lastCharWasStar = false
        let violation = false
        let queryElements = []
        for (let i = 0; i < query.length; i++) {
            if (query[i] === "l") {
                i += ("lambda".length - 1); 
                queryElements.push("lambda")
            } else queryElements.push(query[i])
        }

        for (let item in queryElements) {
            if (queryElements[item] === '*') {
                if (lastCharWasStar) violation = true
                lastCharWasStar = true
            }
            if (queryElements[item] === "(") openParentheses++
            if (queryElements[item] === ")") closeParentheses++
            if (queryElements[item] !== "*") lastCharWasStar = false
            if (openParentheses < closeParentheses) throw "Error! You put an unneccesary closing parentheses\n\n"
        }
        if (openParentheses !== closeParentheses || violation) {
            throw "Error! Make sure all open parentheses have closing parentheses and all *'s follow characters \
            \nor groups for which you want to allow repetitions\n\n"
        }
        return [queryElements, openParentheses]
    }

    handleQueryEvaluation (query) {
        // [TODO]: 
        // validate the input further and begin search strategy to return boolean
        // NOTES:
        // take query and use validateFunction() 
        // store polished query as an array split up
        let validation = this.validateAndFormat(query)
        let array = validation[0]
        let parenthesesPairs = validation[1]
        // find groups 
        let newArr = []
        console.log(parenthesesPairs)
        for (let i = 0; i < array.length; i++) {
            
        }

        // Create 2D array called history to keep track of 'path' to end state
        let pathHistory = []

    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sleep (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

async function runSimulation () {
    let nfa = new NFA()
    const stateRegex = /([A-Z]*[*]?)\s-[\[](lambda|[01])[\]]->\s([A-Z]*[*]?)/
    const queryRegex = /(0*(\()*(\))*(\*)*1*(lambda)*)*/
    const prompt = require('prompt-sync')({sigint: true});

    // This variable is used to determine if the app should continue prompting the user for input
    let exitCommand = false;
 
    console.log("------------- Beginning NFA Encoder --------------\n")
    await sleep(1000)
    console.log("Commands: \n \
            \\clear -> clear all states\n \
            \\l -> list of states w/ transitions \n \
            \\c -> list of commands \n \
            \\d -> directions \n \
            \\q -> quit \n")
    await sleep(500)
    process.stdout.write('Loading')
    for (let i = 0; i < 3; i++) await sleep(250); process.stdout.write('.'); 
 
    await sleep(200)
    console.log("\n\n\nLet's start creating your NFA, if you need directions, type '\\d'\n")

    while (!exitCommand) {
        // Get user input
        let input = prompt('> ')
 
        // inputHandler
        switch (input) {
            case '\\q': 
                exitCommand = true
                break
            case '\\c': 
                await sleep(500)
                console.log("Commands: \n \
                \\clear -> clear all states\n\
                \\l -> list of states w/ transitions\n \
                \\c -> list of commands \n \
                \\d -> directions \n \
                \\q -> quit \n")
                break
            case '\\d':
                await sleep(500)
                console.log("Type in the correct format to create states and transitions, the first state you create will be the start state\n \
                \nAccept state flag: '*' (placed immediately after state name)\
                \nTransitions:     '0', '1', 'lambda' \
                \nStates:       Capital letters (A-Z) \
                \nFormat:       {state} -[transition]-> {state} \
                \nEx:        A -[0]-> B*\n\n")
                break
            case '\\clear':
                await sleep(500)
                nfa.clearAll()
                break
            case '\\l':
                await sleep(500)
                if (Object.keys(nfa.states).length > 0) {
                    for (let key in nfa.states) {
                        console.log(`State (${key + ((nfa.states[key].accepted) ? "*" : "")}) = {`)
                        nfa.states[key].toString()
                        console.log("}\n")
                    }
                    console.log("\n")
                } else {
                    console.log("No states to see here...\n\n")
                }
                break
            case '\\query':
                await sleep(500)
                console.log("To query, type in a string of transitions and we'll figure out \
                \nif its accepted by your NFA\n \
                \nEx: (010)*11 ")
                break
            default: 
                if (stateRegex.test(input)) {
                    nfa.handleStates(input)
                    break
                } else if (queryRegex.test(input)) {
                    console.log("checking to see if the string is accepted")
                    nfa.handleQueryEvaluation(input)
                    break
                }
                console.log("Thats not a valid input, please try again with the proper format: \nEx: A -[1]-> B \
                \nOr query with something like: (010)*11 \n");
        }
    }
}

runSimulation()
