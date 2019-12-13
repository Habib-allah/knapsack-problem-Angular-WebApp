import { Component, OnInit } from '@angular/core';
import { NgForm } from '../../node_modules/@angular/forms';

declare var M:any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  items:Item[];//ARRAY OF ALL OBJECTS
  selectedItem:Item ={name:"", //JUST TO DELET AN ITEM
                      value:null,
                      weight:null};

  editing:boolean=false;
  editedItem:Item=  {name:"", //JUST TO EDIT AN ITEM
                    value:null,
                    weight:null,
                  };

  maxWeight=50; //THE USER SHOULD ENTER THIS VALUE
  maxGain;
              

  ngOnInit(){
    this.items=[{name:"obj1",value:60,weight:10,chosen:false},
                {name:"obj2",value:100,weight:20,chosen:false},
                {name:"obj3",value:120,weight:30,chosen:false}];
  }
  knapsack(items, capacity){
    // This implementation uses dynamic programming.
    // Variable 'memo' is a grid(2-dimentional array) to store optimal solution for sub-problems,
    // which will be later used as the code execution goes on.
    // This is called memoization in programming.
    // The cell will store best solution objects for different capacities and selectable items.
    var memo = [];
  
    // Filling the sub-problem solutions grid.
    for (var i = 0; i < items.length; i++) {
      // Variable 'cap' is the capacity for sub-problems. In this example, 'cap' ranges from 1 to 50.
      var row = [];
      for (var cap = 1; cap <= capacity; cap++) {
        row.push(getSolution(i,cap));
      }
      memo.push(row);
    }
  
    // The right-bottom-corner cell of the grid contains the final solution for the whole problem.
    return(getLast());
  
    function getLast(){
      var lastRow = memo[memo.length - 1];
      return lastRow[lastRow.length - 1];
    }
  
    function getSolution(row,cap){
      const NO_SOLUTION = {maxValue:0, subset:[]};
      // the column number starts from zero.
      var col = cap - 1;
      var lastItem = items[row];
      // The remaining capacity for the sub-problem to solve.
      var remaining = cap - lastItem.weight;
  
      // Refer to the last solution for this capacity,
      // which is in the cell of the previous row with the same column
      var lastSolution = row > 0 ? memo[row - 1][col] || NO_SOLUTION : NO_SOLUTION;
      // Refer to the last solution for the remaining capacity,
      // which is in the cell of the previous row with the corresponding column
      var lastSubSolution = row > 0 ? memo[row - 1][remaining - 1] || NO_SOLUTION : NO_SOLUTION;
  
      // If any one of the items weights greater than the 'cap', return the last solution
      if(remaining < 0){
        return lastSolution;
      }
  
      // Compare the current best solution for the sub-problem with a specific capacity
      // to a new solution trial with the lastItem(new item) added
      var lastValue = lastSolution.maxValue;
      var lastSubValue = lastSubSolution.maxValue;
  
      var newValue = lastSubValue + lastItem.value;
      if(newValue >= lastValue){
        // copy the subset of the last sub-problem solution
        var _lastSubSet = lastSubSolution.subset.slice();
        _lastSubSet.push(lastItem);
        return {maxValue: newValue, subset:_lastSubSet};
      }else{
        return lastSolution;
      }
    }
  }

  async findMax(){
    //console.log(this.knapsack(this.items,this.maxWeight))
    if(this.maxWeight>0){
      console.log(this.items)
      var sol= await this.knapsack(this.items,this.maxWeight);
      console.log(sol)
      this.maxGain=sol.maxValue
    //console.log(sol)
    this.updateChosen(sol);
    }else {
      console.log("wesh les hommes");
    }
    
  }

  /* findMax(){
     this.maxValue().then(res=>{
      console.log(res);
    });
    this.maxValue().catch(err=>{
      console.log(err)
    })

  }

  maxValue():Promise<number>{
    return new Promise((resolve,reject)=>{
      var T:number[][]=[];
      for(var i: number = 0; i <= this.items.length; i++) {
        console.log('boucle1 ', i,'\n');
        T[i] = [];
        for(var j: number = 0; j<= this.maxWeight; j++) {
          console.log(' boucle2 ', j,'\n');
          if (i==0 || j==0){
            T[i][j]=0;
          }
          else if (this.items[i-1].weight<=j){
            T[j][j]=this.maxi(this.items[i-1].value+T[i-1][j-this.items[i-1].weight],T[i-1][j]);
          }
          else{
            T[i][j]=T[i-1][j];
          }
      }
    }
      resolve(T[this.items.length][this.maxWeight]);
      reject('heyworld')
    });
  }

  maxi(a,b){
    return a>b ? a:b;
  } */

  onAdd(form:NgForm){
    if(this.editing){
      this.onDelete(this.editedItem);
    }
    form.value.chosen=false;// Initialize new items to not chosen
    this.items.push(form.value);
    M.toast({ html: 'Saved successfully', classes: 'rounded' });
    this.editing=false;
    this.resetForm();
  }

  onEdit(item:Item){
    this.selectedItem=item;

    this.editedItem.name=item.name;
    this.editedItem.value=item.value;
    this.editedItem.weight=item.weight;

    this.editing=true;
  }

  onDelete(item:Item){
    for(var i=0;i<this.items.length;i++){
      if(this.items[i].name==item.name){
        console.log("object to be removed:" + this.items[i].name)
        this.items.splice(i,1);
      }
    } 
  }


  resetForm(){
    this.selectedItem ={name:"",
    value:null,
    weight:null};  
  }

  resetItems(){
    this.items=[];
  }

  updateChosen(chosenItems){
    console.log(this.maxWeight)
    for(var i=0;i<this.items.length;i++){
     this.items[i].chosen=false;// RE UPDATE THE OLD CHOSEN ONES 
     for (var j=0; j<chosenItems.subset.length;j++){
        if (this.items[i].name==chosenItems.subset[j].name){
          //console.log("this " + this.items[i].name)
          this.items[i].chosen=true;
        }
      } 
    }
  }

}

interface Item {
  name:string,
  value:number,
  weight:number,
  chosen?:boolean
}
