import aside from '@/components/aside/menuList';
import http from '@/utils/request';
const directData = {};
/**
 *  将 aside 数据导入directData
 */
(()=> {
  let arr = aside;
  if(arr.length) {
    arr.forEach(item1 => {
      item1.group.forEach(item2 => {
        directData[item2.link.split('/')[1]] = {
          parent:item1.name,
          name:item2.name,
        }
      })
    });
  }
})();
function a() {
  let arr = arguments[0];
  let mockData = arguments[1];
  let flag = 0;
  if(arr.length) {
    arr.forEach(item1 => {
      item1.group.forEach(item2 => {
        if(mockData[flag]=='1' || mockData[flag] == '0') {
          item2.show = mockData[flag];
          flag++;
        }
      })
    });
  }
  return arr;
};
export default {
    state: {
      asideData: aside,
      allAside:[],
      direct:[]
    },
    mutations: {
      UPDATEDASIDEDATA: (state, newValue ) => {
        state.allAside = newValue;
        if(newValue){
          state.asideData = newValue[0].group;
        }else {
          state.asideData = [];
        }
      },
      UPDATEDIRECT : (state, newValue ) => {
        state.direct = newValue;
      },
      PUSHDIRECT(state, newValue ){
        state.direct.push(newValue);
      },
      POPDIRECT(state, newValue ){
        state.direct.pop();
        console.log(state.direct)
      }
    },
    actions: {
      updatedAsideData( { commit ,state }) {
        return new Promise((resolve, reject) => {
          http.get(`/sys/menu/${state.communityId}/getByOuterKey`)
            .then(res => {
              let menuList =res.data?a(aside,res.data.spread.split('')) : null;
              commit('UPDATEDASIDEDATA', menuList);
              resolve({msg:'success'})
            }).catch(err => {
              reject(err)
            })
        } )
      },
      updateDirect( { commit, state }, nav) {
        if(nav) {
          let moduleList = nav.split('/');
          // console.log(directData)
          let moduleObj = directData[moduleList[1]];
          if(moduleObj) {
            commit('UPDATEDIRECT',[moduleObj['parent'],moduleObj['name']])
          }
        }
      }
    }
  }
