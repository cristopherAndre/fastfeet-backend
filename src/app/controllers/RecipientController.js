import Recipient from '../models/Recipient';
import User from '../models/User';

class RecipientController {
    async get(req, res) {
        const { id } = req.params;
        const recipient = await Recipient.findByPk(id);
        if (!recipient) {
            return res.status(400).json({ error: 'Recipient doesnt exists.' });
        }
        return res.json(recipient);
    }

    async store(req, res) {
        const user = await User.findByPk(req.userId);
        if (!user.admin) {
            return res
                .status(401)
                .json({ error: 'Current user isnt administrator!' });
        }

        const { cep } = req.body;
        const recipientExists = await Recipient.findOne({
            where: { cep },
        });

        if (recipientExists) {
            return res.status(401).json({ error: 'Recipient already exists!' });
        }

        const recipient = await Recipient.create(req.body);
        return res.json(recipient);
    }
}

export default new RecipientController();
