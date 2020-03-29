import * as Yup from 'yup';
import properties from '../../config/properties';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    // Get properties from app.properties file
    const limit = Number(properties.get('pagination.limit.result'));

    const deliverymen = await Deliveryman.findAll({
      limit,
      offset: (page - 1) * limit,
    });
    return res.json(deliverymen);
  }

  async show(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }
    return res.json(deliveryman);
  }

  async store(req, res) {
    // Run field validations
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation Fails' });
    }

    // Check if deliveryman already exists
    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });
    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);
    return res.json({ id, name, email });
  }

  async update(req, res) {
    // Run field validations
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation Fails' });
    }

    const { email } = req.body;
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }
    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({ where: { email } });
      if (deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman already exists!' });
      }
    }
    return res.json(await deliveryman.update(req.body));
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }
    await deliveryman.destroy();
    return res.status(200).send();
  }
}

export default new DeliverymanController();
