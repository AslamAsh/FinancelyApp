import { Table,Select,Radio } from "antd"
import { useState } from "react";
import SearchImg from '../../assets/search.svg';
import './style.css'
import { toast } from "react-toastify";
import {unparse,parse} from 'papaparse';


const TransactionsTables = ({transactions,addTransaction,fetchTransactions}) => {
   const [search,setSearch]=useState('');
   const [typeFilter,setTypeFilter]=useState("")
   const [sortKey,setSortKey]=useState("");
    const columns=[
        {
            title:"Name",
            dataIndex:"name",
            key:"name"
        },
        {
            title:"Amount",
            dataIndex:"amount",
            key:"amount"
        },
        {
            title:"Tag",
            dataIndex:"tag",
            key:"tag"
        },
        {
            title:"Type",
            dataIndex:"type",
            key:"type"
        },
        {
            title:"Date",
            dataIndex:"date",
            key:"date"
        }
    ]
   
   let filteredTransactions = transactions.filter((item) =>
  item?.name?.toLowerCase().includes(search.toLowerCase()) &&
  item?.type?.includes(typeFilter)
);
    let sortedTransactions=filteredTransactions.sort((a,b)=>{
        if(sortKey==="date"){
            return new Date(a.date)-new Date(b.date);

        }else if(sortKey==="amount")
        {
            return a.amount-b.amount;
        }
        else{
return 0;
        }
    })


    function exportCSV() {
  var csv = unparse({
    fields: ["name", "type", "tag", "date", "amount"],
    data:transactions
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "transactions.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
 
function importFromCsv(event) {
  event.preventDefault();
  try {
    parse(event.target.files[0], {
      header: true,
      complete: async function (results) {
        // Filter out empty/incomplete rows
        const validTransactions = results.data.filter(
          (t) => t.name && t.type && t.amount
        );

        for (const transaction of validTransactions) {
          const newTransaction = {
            ...transaction,
            amount: parseFloat(transaction.amount),
          };
          await addTransaction(newTransaction, true);
        }

        // ✅ Now runs AFTER all transactions are added
        toast.success("All Transactions Added");
        fetchTransactions();
        event.target.files = null;
      },
    });
  } catch (e) {
    toast.error(e.message);
  }
}
   return (
  <div>

    {/* 🔹 Search + Filter */}
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      <div className="input-flex">
        <img src={SearchImg} width="16" alt="search" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
        />
      </div>

      <Select
        className="select-input"
        onChange={(value) => setTypeFilter(value)}
        value={typeFilter}
        placeholder="Filter"
        allowClear
      >
        <Select.Option value="">All</Select.Option>
        <Select.Option value="income">Income</Select.Option>
        <Select.Option value="expense">Expense</Select.Option>
      </Select>
    </div>

    {/* 🔹 Header Row */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
      }}
    >
      {/* Left */}
      <h2>My Transactions</h2>

      {/* Middle */}
      <Radio.Group
        className="input-radio"
        onChange={(e) => setSortKey(e.target.value)}
        value={sortKey}
      >
        <Radio.Button value="">No Sort</Radio.Button>
        <Radio.Button value="date">Sort by Date</Radio.Button>
        <Radio.Button value="amount">Sort by Amount</Radio.Button>
      </Radio.Group>

      {/* Right */}
      <div style={{ display: "flex", gap: "1rem" }} >
        <button className="btn" onClick={exportCSV} >
          Export to CSV
        </button>

        <label htmlFor="file-csv" className="btn btn-blue">
          Import from CSV
        </label>

        <input
          id="file-csv"
          type="file"
          accept=".csv"
           onChange={importFromCsv}
          style={{ display: "none" }}
        />
      </div>
    </div>

    {/* 🔹 Table */}
    <Table dataSource={sortedTransactions} columns={columns} />

  </div>
);
}

export default TransactionsTables
