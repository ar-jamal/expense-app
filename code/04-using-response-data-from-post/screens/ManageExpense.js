import { useContext, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import { ExpensesContext } from '../store/expenses-context';
import { storeExpense, uptoDateExpense, deleteExpense } from '../util/http';
import LoadingOverlay from '../components/UI/LoadingOverlay';

function ManageExpense({ route, navigation }) {
  const [isAdding, setIsAdding] = useState(false)
  const expensesCtx = useContext(ExpensesContext);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;
  const [editingId, setEditingId] = useState(editedExpenseId)

  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expense' : 'Add Expense',
    });
  }, [navigation, isEditing]);
  
  if (isAdding) {
    return <LoadingOverlay />
  }

  function deleteExpenseHandler() {
    setIsAdding(true)
    deleteExpense(editedExpenseId);
    expensesCtx.deleteExpense(editedExpenseId); 
    navigation.goBack();
  }
  
  // async function addNewExpense (expenseData) {
  //    const id = await storeExpense(expenseData);
  //     setEditingId(id)
  //     expensesCtx.addExpense({ ...expenseData, id: id });
  //     navigation.goBack()
  //   }

  function cancelHandler() {
    navigation.goBack();
  }
  async function confirmHandler(expenseData) {
    if (isEditing) {
      setIsAdding(true)
      await uptoDateExpense(editedExpenseId, expenseData)
      setIsAdding(false)
      expensesCtx.updateExpense(editedExpenseId, expenseData);

    } else {
      setIsAdding(true)
      const id = await storeExpense(expenseData);
      setIsAdding(false)
      expensesCtx.addExpense({ ...expenseData, id: id });
    }
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? 'Update' : 'Add'}
        onSubmit={confirmHandler}
        // onSubmitNew= {addNewExpense}
        checkExpId= {editedExpenseId}
        onCancel={cancelHandler}
        defaultValues={selectedExpense}
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
});
