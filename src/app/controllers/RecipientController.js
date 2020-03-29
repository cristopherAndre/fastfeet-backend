import * as Yup from 'yup';
import properties from '../../config/properties';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { page = 1 } = req.query;

    // Get properties from app.properties file
    const limit = Number(properties.get('pagination.limit.result'));

    const recipients = await Recipient.findAll({
      limit,
      offset: (page - 1) * limit,
    });
    return res.json(recipients);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.params)))
      return res.status(400).json({ error: 'Validation fails' });

    const recipient = await Recipient.findByPk(req.params.id, {
      attributes: [
        'id',
        'name',
        'street',
        'number',
        'complement',
        'state',
        'city',
        'cep',
      ],
    });

    if (!recipient)
      return res.status(400).json({ error: 'Recipient not found' });

    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number()
        .positive()
        .required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string()
        .required()
        .length(8),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

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

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number().positive(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      cep: Yup.string().length(8),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient)
      return res.status(400).json({ error: 'Recipient not found' });

    return res.json(await recipient.update(req.body));
  }

  async destroy(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.params)))
      return res.status(400).json({ error: 'Validation fails' });

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient)
      return res.status(400).json({ error: 'Recipient not found' });

    recipient.destroy();

    return res.send();
  }
}

export default new RecipientController();
