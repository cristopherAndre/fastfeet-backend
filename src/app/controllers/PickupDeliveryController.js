import { isAfter, isBefore, setHours } from 'date-fns';
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

    // Check if delivery is started already
    if (delivery.start_date !== null) {
      return res.status(400).json({ error: 'Delivery already started' });
    }

    const currentDate = new Date();

    if (
      isBefore(currentDate, setHours(new Date(), 8)) ||
      isAfter(currentDate, setHours(new Date(), 22))
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
