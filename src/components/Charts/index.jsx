import { Line, Pie } from "@ant-design/charts";

const Charts = ({ sortedTransaction }) => {
  const data = sortedTransaction.map((item) => ({
    date: item.date,
    amount: item.amount,
  }));

  let spendingData = sortedTransaction
    .filter((transaction) => transaction.type === "expense")
    .map((transaction) => ({
      tag: transaction.tag,
      amount: transaction.amount,
    }));

  let finalSpendings = Object.values(
    spendingData.reduce((acc, obj) => {
      let key = obj.tag;
      if (!acc[key]) {
        acc[key] = { tag: obj.tag, amount: obj.amount };
      } else {
        acc[key].amount += obj.amount;
      }
      return acc;
    }, {})
  );

  let newSpendings = [
  { tag: "food", amount: 0 },
  { tag: "education", amount: 0 },
  { tag: "office", amount: 0 },
];

spendingData.forEach((item) => {
  if (item.tag == "food") {
    newSpendings[0].amount += item.amount;
  } else if (item.tag == "education") {
    newSpendings[1].amount += item.amount;
  } else {
    newSpendings[2].amount += item.amount;
  }
});

  const spendingconfig = {
    data: finalSpendings,
    angleField: "amount",
    colorField: "tag",
    autoFit: true,
  };

  const config = {
    data: data,
    xField: "date",
    yField: "amount",
    autoFit: true,
  };

  return (
    <div className="charts-wrapper">
      <div>
        <h2>Your Analytics</h2>
        <Line {...config} />
      </div>
      <div>
        <h2>Your Spendings</h2>
        <Pie {...spendingconfig} />
      </div>
    </div>
  );
};

export default Charts;