import { useEffect, useState } from "react";
import "./ExpenseTracker.css";
import ExpenseChart from "./ExpenseChart";
import { Typography } from "@mui/material";
import ReactModal from "react-modal";
import { PiPizza } from "react-icons/pi";
import { TiDeleteOutline } from "react-icons/ti";
import { BiPencil } from "react-icons/bi";
import { PiGiftThin } from "react-icons/pi";
import { IoWatchOutline } from "react-icons/io5";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import ExpenseBarChart from "./ExpenseBarChart";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

ReactModal.setAppElement("#root");

export default function ExpenseTracker() {
  const [showModal, setShowModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem("walletBalance");
    return saved !== null ? parseFloat(saved) : 5000;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [income, setIncome] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const expensePerPage = 3;

  const totalPages = Math.ceil(expenses.length / expensePerPage);

  const paginationExpenses = expenses
    .slice()
    .reverse()
    .slice((currPage - 1) * expensePerPage, currPage * expensePerPage);

  const handleLeftArrowPage = () => {
    if (currPage > 1) setCurrPage((prev) => prev - 1);
  };

  const handleRightArrowPage = () => {
    if (currPage < totalPages) setCurrPage((prev) => prev + 1);
  };

  useEffect(() => {
    localStorage.setItem("walletBalance", String(walletBalance));
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const resetExpenseForm = () => {
    setTitle("");
    setPrice("");
    setCategory("");
    setDate("");
    setEditingId(null);
  };

  const handleAddIncomeOpen = () => setShowIncomeModal(true);
  const handleAddIncomeClose = () => {
    setIncome("");
    setShowIncomeModal(false);
  };

  const handleAddIncomeSubmit = (e) => {
    e.preventDefault();
    if (income === "" || income === null) {
      enqueueSnackbar("Please enter an amount", { variant: "warning" });
      return;
    }
    const amount = parseFloat(income);
    if (isNaN(amount) || amount <= 0) {
      enqueueSnackbar("Enter a valid amount", { variant: "error" });
      return;
    }
    setWalletBalance((prev) => prev + amount);
    enqueueSnackbar(`₹${amount.toFixed(2)} added to wallet`, {
      variant: "success",
    });
    setIncome("");
    setShowIncomeModal(false);
  };

  const handleAddExpenseOpen = () => {
    resetExpenseForm();
    setShowModal(true);
  };
  const handleAddExpenseClose = () => {
    resetExpenseForm();
    setShowModal(false);
  };

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();

    if (!title || price === "" || !category || !date) {
      enqueueSnackbar("Please fill all the fields", { variant: "warning" });
      return;
    }

    const amount = parseFloat(price);
    if (isNaN(amount) || amount <= 0) {
      enqueueSnackbar("Enter a valid amount", { variant: "error" });
      return;
    }

    if (amount > walletBalance) {
      enqueueSnackbar("Insufficient Balance", { variant: "error" });
      return;
    }

    if (editingId) {
      setExpenses((prev) =>
        prev.map((exp) => {
          if (exp.id !== editingId) return exp;
          const diff = amount - exp.price;
          setWalletBalance((wbPrev) => wbPrev - diff);
          return { ...exp, title, price: amount, category, date };
        })
      );
      enqueueSnackbar("Expense updated successfully", { variant: "info" });
      resetExpenseForm();
      setShowModal(false);
      return;
    }

    const newExp = {
      id: Date.now().toString(),
      title,
      price: amount,
      category,
      date,
    };

    setExpenses((prev) => [...prev, newExp]);
    setWalletBalance((prev) => prev - amount);
    enqueueSnackbar("Expense added successfully", { variant: "success" });

    resetExpenseForm();
    setShowModal(false);
  };

  const handleDeleteExpense = (id) => {
    const toDelete = expenses.find((e) => e.id === id);
    if (!toDelete) return;

    setWalletBalance((prev) => prev + toDelete.price);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    enqueueSnackbar("Expense deleted", { variant: "info" });
  };

  const handleEditExpense = (id) => {
    const exp = expenses.find((e) => e.id === id);
    if (!exp) return;
    setTitle(exp.title);
    setPrice(String(exp.price));
    setCategory(exp.category);
    setDate(exp.date);
    setEditingId(id);
    setShowModal(true);
  };

  const categories = ["Food", "Entertainment", "Travel"];
  const chartData = categories.map((i) => ({
    name: i,
    value: expenses
      .filter((e) => e.category === i)
      .reduce((sum, e) => sum + e.price, 0),
  }));

  const totalExpense = expenses.reduce((sum, e) => sum + e.price, 0);

  const getCategoryIcon = (e) => {
    if (e === "Food") return <PiPizza style={iconStyle} />;
    if (e === "Entertainment") return <PiGiftThin style={iconStyle} />;
    if (e === "Travel") return <IoWatchOutline style={iconStyle} />;
    return <PiPizza style={iconStyle} />;
  };
  const iconStyle = {
    height: "38px",
    width: "38px",
    padding: "14px",
    borderRadius: "50%",
    backgroundColor: "#D9D9D9",
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <div style={{ margin: "20px" }}>
        <div className="expense-tracker">
          <h1
            style={{
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "32px",
              color: "white",
              lineHeight: "100%",
              letterSpacing: 0,
            }}
          >
            Expense Tracker
          </h1>
          <div className="container">
            <div className="inner-container">
              <div className="wallet-balance">
                <h2 style={{ margin: 0, fontStyle: "bold" }}>
                  Wallet Balance:{" "}
                  <span style={{ color: "#9DFF5B", fontWeight: 700 }}>
                    ₹{walletBalance}
                  </span>
                </h2>

                <button
                  type="button"
                  className="add-btn"
                  onClick={handleAddIncomeOpen}
                >
                  + Add Income
                </button>
                <ReactModal
                  isOpen={showIncomeModal}
                  onRequestClose={handleAddIncomeClose}
                  style={{
                    overlay: {
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "#FFFFFFC4",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    content: {
                      position: "relative",
                      inset: "auto",
                      border: "1px solid #EFEFEFD9",
                      background: "#EFEFEFD9",
                      borderRadius: "15px",
                      overflow: "auto",
                      WebkitOverflowScrolling: "touch",
                      outline: "none",
                      padding: "40px",
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{ fontWeight: 700, fontSize: "30px", marginBottom: 2 }}
                  >
                    Add Balance
                  </Typography>

                  <form className="form" onSubmit={handleAddIncomeSubmit}>
                    <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                      <input
                        name="income"
                        type="number"
                        placeholder="Income Amount"
                        className="input"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        style={{ width: "217px" }}
                      />
                      <button
                        type="submit"
                        className="add-expense-btn"
                        style={{ width: 145 }}
                      >
                        Add Balance
                      </button>
                      <button
                        type="button"
                        onClick={handleAddIncomeClose}
                        className="cancel-btn"
                        style={{ width: 112 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </ReactModal>
              </div>

              <div className="expenses">
                <h2 style={{ margin: 0 }}>
                  Expenses:{" "}
                  <span style={{ color: "#F4BB4A" }}>₹{totalExpense}</span>
                </h2>

                <button
                  type="button"
                  className="add-expense"
                  onClick={handleAddExpenseOpen}
                >
                  + Add Expense
                </button>

                <ReactModal
                  isOpen={showModal}
                  onRequestClose={handleAddExpenseClose}
                  style={{
                    overlay: {
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "#FFFFFFC4",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    content: {
                      position: "relative",
                      inset: "auto",
                      border: "1px solid #EFEFEFD9",
                      background: "#EFEFEFD9",
                      borderRadius: "15px",
                      overflow: "auto",
                      WebkitOverflowScrolling: "touch",
                      outline: "none",
                      padding: "40px",
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{ fontWeight: 700, fontSize: "30px", marginBottom: 2 }}
                  >
                    {editingId ? "Edit Expense" : "Add Expenses"}
                  </Typography>

                  <form className="form" onSubmit={handleAddExpenseSubmit}>
                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      <input
                        name="title"
                        value={title}
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="input"
                      />
                      <input
                        name="price"
                        value={price}
                        type="number"
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price"
                        className="input"
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: 10,
                      }}
                    >
                      <select
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="select-input"
                      >
                        <option value="" disabled>
                          Category
                        </option>
                        <option value="Food">Food</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Travel">Travel</option>
                      </select>

                      <input
                        name="date"
                        value={date}
                        type="date"
                        onChange={(e) => setDate(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div
                      style={{ display: "flex", gap: "10px", marginTop: 12 }}
                    >
                      <button type="submit" className="add-expense-btn">
                        Add Expense
                      </button>
                      <button
                        type="button"
                        onClick={handleAddExpenseClose}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </ReactModal>
              </div>
            </div>

            {/* <div style={{ display: "flex"}}> */}
            <div className="chart">
              {expenses.length > 0 && <ExpenseChart data={chartData} />}

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "end",
                  marginTop: 8,
                }}
              >
                <div className="expense-types">
                  <div className="small-rectangle-purple"></div>
                  <span>Food</span>
                </div>
                <div className="expense-types">
                  <div className="small-rectangle-orange"></div>
                  <span>Entertainment</span>
                </div>
                <div className="expense-types">
                  <div className="small-rectangle-yellow"></div>
                  <span>Travel</span>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>

      <div className="transactions-tracker">
        <div className="recent-transactions">
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "32px",
              lineHeight: "100%",
              letterSpacing: 0,
              margin: 1,
              marginTop: 4,
            }}
          >
            Recent Transactions
          </Typography>

          <div className="transaction-container">
            {expenses.length === 0 ? (
              <h2>No Transactions!</h2>
            ) : (
              <div className="transactions-mobile">
                {/* {expenses
                  .slice()
                  .reverse()
                  .map((exp) => (
                    <div key={exp.id}>
                      <div className="product-expense">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                          }}
                        >
                          {getCategoryIcon(exp.category)}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "400",
                                color: "black",
                              }}
                            >
                              {exp.title}
                            </span>
                            <span
                              style={{
                                color: "#9B9B9B",
                                fontSize: "16px",
                                fontWeight: "400",
                              }}
                            >
                              {exp.date}
                            </span>
                          </div>
                        </div>

                        <div className="for-exp-price-edit">
                          <span
                            style={{
                              fontSize: "16px",
                              color: "#F4BB4A",
                              fontWeight: 700,
                            }}
                          >
                            ₹{exp.price.toFixed(2)}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <TiDeleteOutline
                              style={{
                                height: "37px",
                                width: "37px",
                                padding: "5px",
                                borderRadius: "15px",
                                backgroundColor: "#ff3e3e",
                                color: "white",
                                cursor: "pointer",
                              }}
                              onClick={() => handleDeleteExpense(exp.id)}
                            />
                            <BiPencil
                              style={{
                                height: "37px",
                                width: "37px",
                                padding: "5px",
                                borderRadius: "15px",
                                backgroundColor: "#f4bb4a",
                                color: "white",
                                cursor: "pointer",
                              }}
                              onClick={() => handleEditExpense(exp.id)}
                            />
                          </div>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))} */}
                {paginationExpenses.map((exp) => (
                  <div key={exp.id}>
                    <div className="product-expense">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        {getCategoryIcon(exp.category)}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "400",
                              color: "black",
                            }}
                          >
                            {exp.title}
                          </span>
                          <span
                            style={{
                              color: "#9B9B9B",
                              fontSize: "16px",
                              fontWeight: "400",
                            }}
                          >
                            {exp.date}
                          </span>
                        </div>
                      </div>

                      <div className="for-exp-price-edit">
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#F4BB4A",
                            fontWeight: 700,
                          }}
                        >
                          ₹{exp.price.toFixed(2)}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <TiDeleteOutline
                            style={{
                              height: "37px",
                              width: "37px",
                              padding: "5px",
                              borderRadius: "15px",
                              backgroundColor: "#ff3e3e",
                              color: "white",
                              cursor: "pointer",
                            }}
                            onClick={() => handleDeleteExpense(exp.id)}
                          />
                          <BiPencil
                            style={{
                              height: "37px",
                              width: "37px",
                              padding: "5px",
                              borderRadius: "15px",
                              backgroundColor: "#f4bb4a",
                              color: "white",
                              cursor: "pointer",
                            }}
                            onClick={() => handleEditExpense(exp.id)}
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    marginTop: "20px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  >
                  <div style={{ display: "flex", gap: "12px" }}>
                    <FaArrowLeftLong
                      className="arrows"
                      onClick={handleLeftArrowPage}
                      style={{opacity: currPage === 1 ? 0.5 : 1, cursor: currPage === 1 ? "not-allowed" : "pointer" }}
                    />
                    <div className="page-number">{currPage}</div>
                    <FaArrowRightLong
                      className="arrows" 
                      onClick={handleRightArrowPage}
                      style={{opacity: currPage === totalPages ? 0.5 : 1, cursor: currPage === totalPages ? "not-allowed" : "pointer" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="top-expenses">
          <div className="expenses-inside">
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                fontStyle: "italic",
                fontSize: "32px",
                lineHeight: "100%",
                letterSpacing: 0,
                margin: 1,
                marginTop: 4,
                color: "white",
              }}
            >
              Top Expenses
            </Typography>
            <div className="top-expenses-container">
              <ExpenseBarChart data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </SnackbarProvider>
  );
}
