class PetitionController {
    async createPetition(req, res) {
        res.json({message: "hello"})
    }
}

module.exports = new PetitionController()