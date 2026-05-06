import { CustomerLedger } from '../models/CustomerLedger.js';
import { TRANSACTION_TYPES } from '../constants/enums.js';

export class LedgerService {
  // Add transaction and update balance
  static async addTransaction(customerId, transactionType, amount, description, date) {
    try {
      const customer = await CustomerLedger.findById(customerId);

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Calculate new balance based on transaction type
      let newBalance = customer.balance;

      if (transactionType === TRANSACTION_TYPES.UDHAR) {
        newBalance += amount; // Customer owes more
      } else if (transactionType === TRANSACTION_TYPES.WAPSI) {
        newBalance -= amount; // Customer paid
      } else if (transactionType === TRANSACTION_TYPES.NIL) {
        newBalance = 0; // Settlement
      }

      // Add transaction to embedded array
      customer.transactions.push({
        transactionType,
        description,
        amount,
        netBalance: newBalance,
        date: date || new Date(),
      });

      // Update balance
      customer.balance = newBalance;

      await customer.save();

      return customer;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  // Delete transaction and recalculate balance
  static async deleteTransaction(customerId, transactionId) {
    try {
      const customer = await CustomerLedger.findById(customerId);

      if (!customer) {
        throw new Error('Customer not found');
      }

      const txIndex = customer.transactions.findIndex(
        (tx) => tx._id.toString() === transactionId
      );

      if (txIndex === -1) {
        throw new Error('Transaction not found');
      }

      customer.transactions.splice(txIndex, 1);

      // Recalculate balance from scratch
      let balance = 0;
      for (const tx of customer.transactions) {
        if (tx.transactionType === TRANSACTION_TYPES.UDHAR) {
          balance += tx.amount;
        } else if (tx.transactionType === TRANSACTION_TYPES.WAPSI) {
          balance -= tx.amount;
        } else if (tx.transactionType === TRANSACTION_TYPES.NIL) {
          balance = 0;
        }
      }

      customer.balance = balance;

      await customer.save();

      return customer;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Get customer with all transactions
  static async getCustomerTransactions(customerId) {
    try {
      return await CustomerLedger.findById(customerId);
    } catch (error) {
      console.error('Error getting customer transactions:', error);
      throw error;
    }
  }
}

export default LedgerService;
