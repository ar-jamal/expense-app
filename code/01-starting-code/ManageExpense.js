import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import { ExpensesContext } from '../store/expenses-context';
import CusInput from '../components/customInput'
import ExpenseForm from '../manageExpense/ExpenseForm';

function ManageExpense({ route, navigation }) {
  const [inputValues, setInputValues] = useState({
    amount: '',
    date: '',
    description: '',
  });
  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputValues((curInputValues) => {
        return {
            ...curInputValues,
            [inputIdentifier]: enteredValue,
        };
    });
}
  const expensesCtx = useContext(ExpensesContext);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  useEffect(() => {
    const savedData =
      expensesCtx.expenses.filter((expense) =>
        expense.id === editedExpenseId)
    setInputValues(savedData)    

  }, [editedExpenseId])

  useLayoutEffect(() => {
    navigation.setOptions({
      description: isEditing ? 'Edit Expense' : 'Add Expense',
    });
  }, [navigation, isEditing]);

  function deleteExpenseHandler() {
    expensesCtx.deleteExpense(editedExpenseId);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  function confirmHandler(expenseData) {
    if (isEditing) {

      expensesCtx.updateExpense(editedExpenseId, expenseData);
    } else {
      expensesCtx.addExpense(expenseData);
    }
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        onSelect={cancelHandler}
        onSubmit={confirmHandler}
        buttonTitleHandler={isEditing ? 'Edit' : 'Add'}

      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 24,
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
  },
});
