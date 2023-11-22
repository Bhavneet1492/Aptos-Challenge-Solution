#[test_only]
module counter_addr::counter_tests {
    use std::signer;
    use std::unit_test;
    use std::vector;

    use counter_addr::counter;

    fun get_account():signer{
        vector::pop_back(&mut unit_test::create_signers_for_testing(1))
    }

    #[test]
    public entry fun test_if_it_init(){
        let account = get_account();
        let addr = signer::address_of(&account);
        aptos_framework::account::create_account_for_test(addr);
        counter::click(account);
        assert!(
            counter::get_count(addr) == 0,
            0
        );
        let account = get_account();
        counter::click(account);
        assert!(
            counter::get_count(addr) == 1,
            0
        );
        let account = get_account();
        counter::click(account);
        assert!(
            counter::get_count(addr) == 2,
            0
        );

    }
}