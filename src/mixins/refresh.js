export default {
  props:{
    refresh:{
      default:false
    }
  },
  methods:{
    handleRefresh(){

    }
  },
  watch:{
    refresh(newVal){
      if(newVal) this.handleRefresh();
    }
  }
}
