import Button from '../Button'
import './index.css'
import {Row,Card} from 'antd'
const Cards = ({showExpenseModal,showIncomeModal,income,expense,totalBalance}) => {
  return (
    <div>
        <Row className="my-row">
            <Card className="my-card" bordered={true}>
                <h2>Current Balance</h2>
                <p>${totalBalance}</p>
                 
                 <Button text="Reset button" blue={true}> </Button>

                 
            </Card>
            <Card className="my-card" bordered={true}>
                <h2>Total Income</h2>
                <p>${income}</p>
                 
                  <Button text="Add Income" blue={true} onClick={showIncomeModal}> </Button>

                 
            </Card>
            <Card className="my-card" bordered={true}>
                <h2>Total Expenses</h2>
                <p>${expense}</p>
                  <Button text="Add Expenses" blue={true} onClick={showExpenseModal}> </Button>

                 
            </Card>
           
        </Row>
      
    </div>
  )
}

export default Cards
