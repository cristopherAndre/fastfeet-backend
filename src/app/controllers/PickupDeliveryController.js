import { isAfter, isBefore, setHours } from 'date-fns';
import Properties from '../../config/properties';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class PickupDeliveryController {
  async update(req, res) {
    const { deliverymanId, deliveryId } = req.params;

    // Check if Deliveryman exists
    const deliveryman = await Deliveryman.findByPk(deliverymanId);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman doesnt exists' });
    }

    // Check if delivery exists
    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery doesnt exists' });
    }

    // Check if delivery is already started
    if (delivery.start_date !== null) {
      return res.status(400).json({ error: 'Delivery already started' });
    }

    // Check if delivery is canceled
    if (delivery.canceled_at !== null) {
      res.status(401).json({ error: 'Delivery canceled.' });
    }

    const currentDate = new Date();

    // Get properties from app.properties file
    const startPickup = Number(Properties.props.get('delivery.start.pickup'));
    const endPickup = Number(Properties.props.get('delivery.end.pickup'));

    if (
      isBefore(currentDate, setHours(new Date(), startPickup)) ||
      isAfter(currentDate, setHours(new Date(), endPickup))
    ) {
      return res.status(400).json({
        error: 'You can only pickup a delivery between 8:00h and 18:00h.',
      });
    }

    await delivery.update({ start_date: currentDate });

    return res.status(200).json();
  }
}
export default new PickupDeliveryController();
