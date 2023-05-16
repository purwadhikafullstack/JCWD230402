const schedule = require("node-schedule");
const sequelize = require("sequelize");
const model = require("../models");

module.exports = {
  statusUpdater: () => {
    schedule.scheduleJob("16 17 * * *", async () => {
      const today = new Date();
      const findDate = await model.order.findAll({
        where: {
          statusId: 12,
        },
      });

      if (findDate.length > 0) {
        for (let i = 0; i < findDate.length; i++) {
          const targetDate = new Date(findDate[i].dataValues.updatedAt);
          const timeDiff = Math.abs(targetDate - today); // find difference of days
          const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // converting from ms to days

          switch (daysDiff) {
            case 7:
              await model.order.update(
                {
                  statusId: 13,
                },
                {
                  where: {
                    statusId: 12,
                  },
                }
              );

              await model.stockMutation.update(
                {
                  statusId: 13,
                },
                {
                  where: {
                    statusId: 12,
                  },
                }
              );
              break;

            default:
              console.log("lmao");
              break;
          }
        }
      } else {
        return null;
      }
    });
  },
};
