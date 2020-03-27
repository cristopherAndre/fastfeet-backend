import * as Yup from 'yup';
import Properties from '../../config/properties';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import CancelDeliveryMail from '../jobs/CancelDeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    // Get properties from app.properties file
    const limit = Number(Properties.props.get('pagination.limit.result'));

    const deliveryPromblens = await DeliveryProblem.findAll({
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product'],
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name'],
            },
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['name', 'street', 'number', 'city', 'state'],
            },
          ],
        },
      ],
      attributes: ['id', 'description'],
    });

    return res.json(deliveryPromblens);
  }

  async show(req, res) {
    const { deliveryId: delivery_id } = req.params;

    const { page = 1 } = req.query;

    // Get properties from app.properties file
    const limit = Number(Properties.props.get('pagination.limit.result'));

    const deliveryProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id,
      },
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product'],
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name'],
            },
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['name', 'street', 'number', 'city', 'state'],
            },
          ],
        },
      ],
      attributes: ['id', 'description'],
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    // Run Validations
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { deliveryId: delivery_id } = req.params;
    const { description } = req.body;

    // Check id Delivery exists
    const delivery = await Delivery.findByPk(delivery_id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id,
      description,
    });

    return res.json(deliveryProblem);
  }

  async delete(req, res) {
    const { problemId: problem_id } = req.params;

    const problem = await DeliveryProblem.findByPk(problem_id);

    // Check id Problem exists
    if (!problem) {
      return res.status(400).json({ error: 'Problem not found' });
    }

    const delivery = await Delivery.findByPk(problem.delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'street', 'number', 'city', 'state', 'cep'],
        },
      ],
    });

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not exists.' });
    }
    // Check if order has already been delivered
    if (delivery.end_date) {
      return res
        .status(401)
        .json({ error: 'the order has already been delivered.' });
    }

    // Check if order has already been canceled
    if (delivery.canceled_at) {
      return res
        .status(401)
        .json({ error: 'the order has already been canceled.' });
    }

    delivery.canceled_at = new Date();

    await Queue.add(CancelDeliveryMail.key, {
      delivery,
      deliveryman: delivery.deliveryman,
      recipient: delivery.recipient,
    });

    await delivery.save();

    return res.json({ msg: 'Canceled successful.' });
  }
}

export default new DeliveryProblemController();
