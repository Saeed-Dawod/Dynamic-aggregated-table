import _ from "underscore";

export function transform(rows: Array<Array<any>>, fields:Array<any>, options) {   
     console.log( options);
     let xfield_location = options.columns;
     let yfield_location = options.rows;
     let valfield_location = options.value;
     let color_location = options.color;
     let trend_location = options.trend;
     let possibleRows = _.uniq(rows.map(x => x[xfield_location]));
     let PossibleColumns = _.uniq(rows.map(x => x[yfield_location]));     
     let newRows =  possibleRows.map(row => {
          let newRow = PossibleColumns.map(col => {
               let items = rows.filter(f => f[xfield_location] == row && f[yfield_location] == col)
               if (items.length == 0)
                    return {};
               else
                    return {value:items[0][valfield_location],color:items[0][color_location],trend:items[0][trend_location]};
          });
          newRow.unshift(row);
          return newRow;
     });
     let newFields =  PossibleColumns.map(x=> {return {"name":x,"type":"string"}});
     newFields.unshift({"name":"","type":"string"})
     return {rows:newRows,fields:newFields}
};    
